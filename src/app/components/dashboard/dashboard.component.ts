import { Component, OnInit, Inject } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { CoingeckoService } from '../../services/coingecko.service';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import 'chart.js';
import { ApiService, History } from 'src/app/services/api.service';
import { ContractaAddressService } from 'src/app/services/contracta-address.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const Chart;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  tokensInfo: TokenInfo[] = [];
  calculatedTokensInfo: TokenInfo[] = [];
  usersProviderConnected: boolean;
  usersProviderExists: boolean;
  selectedTab = new FormControl(0);
  usersFunds: {erci: number, dai: number};
  usersFundsRaw: {erci: number, dai: number};
  secondCallCounter = 0;
  chartDataSet = false;
  oldData: {erciPrice: number, supply: number, fundValue: number};
  initialHistory: History[];

  // UI shugars
  showNavigation = false;
  showNavigationText = false;

  constructor(
    private contractService: ContractService,
    private coingeckoService: CoingeckoService,
    private apiService: ApiService,
    private contractAddress: ContractaAddressService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    console.log(this.route.snapshot.paramMap.get('address'));
    this.contractAddress.setAddress(this.route.snapshot.paramMap.get('address') || environment.ercIndexAddress);
    
    this.contractService.usersProviderConnected$.subscribe(upc => {
      this.usersProviderConnected = upc;
      this.getUsersFunds();
    });
    this.contractService.usersProviderExists$.subscribe(upe => this.usersProviderExists = upe);
  }

  ngOnInit() {
    this.initChart();
    this.getContractInfo();
    setTimeout(() => this.showNavigation = true, 3000);
    // setTimeout(() => this.showNavigationText = true, 4000);
  }

  getContractInfo() {

    this.contractService.readTopTokens().then((tokens: string[]) => {

      tokens.push(environment.daiTokenAddress); 

      this.tokensInfo = tokens.map(addr => ({address: addr}));

      this.coingeckoService.getTokenInfoFromAddress(tokens).subscribe(coingeckoInfos => {
        
        this.tokensInfo.forEach((tokenInfo, i) => {
          tokenInfo.name = coingeckoInfos[i].symbol.toUpperCase();
          tokenInfo.image = coingeckoInfos[i].image.small;
          tokenInfo.priceUsd = coingeckoInfos[i].market_data.current_price.usd;
          tokenInfo.marketcapCoingecko = coingeckoInfos[i].market_data.market_cap.usd;
          tokenInfo.priceChange7d = coingeckoInfos[i].market_data.price_change_percentage_7d;
        });
        this.calculateTargetValues();
      });

      this.contractAddress.address.pipe(filter(a => !!a)).subscribe(address => {

        this.contractService.getErcTokensInfo(tokens, address).then(info => {
          this.tokensInfo.forEach((tokenInfo, i) => {
            tokenInfo.balance = info[0][i];     // [0] balance array
            tokenInfo.decimals = info[1][i];    // [1] decimals array
            tokenInfo.totalSupply = info[2][i]; // [2] totalSupply array
          });
          this.calculateTargetValues();
        });

      });
    });
  }

  calculateTargetValues() {
    // should execute only after getTokenInfoFromAddress() Observable
    // and getErcTokensInfo Promise both (set their data) and call this function
    if (++this.secondCallCounter % 2 === 0) {
    
      // order all tokens except dai by their marketcap
      const daiTokenInfo = this.tokensInfo.pop();
      this.tokensInfo.sort((a, b) => ((b.totalSupply / (10 ** b.decimals)) * b.priceUsd) - ((a.totalSupply / (10 ** a.decimals)) * a.priceUsd));
      this.tokensInfo.push(daiTokenInfo);

      let totalValue = 0;
    
      for (const token of this.tokensInfo) {
    
        token.indexValueUsd = (token.balance / (10 ** token.decimals)) * token.priceUsd;
        totalValue += token.indexValueUsd;
    
      }

      const tokenCount = this.tokensInfo.length - 1; // don't count dai
      const baseAmount = totalValue / (2 * tokenCount);

      for (let i = 0; i < tokenCount; i++) {
        
        this.tokensInfo[i].targetValueUsd = baseAmount + ((baseAmount * ((tokenCount * 2) - (1 + (2 * i)))) / tokenCount);

      }

      this.tokensInfo[this.tokensInfo.length -1].targetValueUsd = 0; // target 0 for dai

      this.calculatedTokensInfo = this.tokensInfo;

    }
  }

  updateValues() {
    if (this.contractService.usersProviderConnected$) {
      this.getUsersFunds();
    }
    this.getContractInfo();
  }

  getUsersFunds() {
    this.contractService.getUsersFunds().then((funds: any) => {
      this.usersFundsRaw = funds.raw;
      this.usersFunds = funds.rounded;
    });
  }

  initChart() {
		let config = {
      data: {
        labels: [],
				datasets: [{
          data: [],
					borderColor: '#8fa0ff',    // almost blue// borderColor: '#7588ef',    // blue
          lineTension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
          fill: true,
          backgroundColor:'#ffffff00'
				}]
			},
      type: 'line',
			options: {
        animation: {
          duration: 0
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
				title: {
					display: false,
				},
				tooltips: {
          display: false,
				},
				scales: {
          xAxes: [{
            display: false,
            distribution: 'series',
          }],
          yAxes: [{
            display: false,
            type: 'linear',
            id: 'left-y-axis',
            position: 'left',
            ticks: {
              // beginAtZero: true,
              // suggestedMax: 0 // will be set to appropriate value
            },
            gridLines: {
              display:false
            }
          }]
        }
			}
    };
    
    const time = Math.floor(new Date().getTime() / 1000);
    this.apiService.getHistory(time - 604800, time).subscribe((history: History[]) => {
      
      this.initialHistory = history;

      if (!history || history.length === 0) {
        return;
      }

      let ctx = (this.document.getElementById('bannerChart') as HTMLCanvasElement).getContext('2d');

      // if every point is 1 hr apart there are 168 points in a week
      history = history.slice(Math.max(history.length - 168, 0)).reverse();
      
      this.oldData = {
        erciPrice: history[0].tokenPrice,
        fundValue: history[0].usdValue,
        supply: history[0].tokenPrice > 0 ? history[0].usdValue / history[0].tokenPrice : 0
      }

      config.data.labels = Object.keys(history);
      config.data.datasets[0].data = history.map(data => data.tokenPrice);
      
      new Chart(ctx, config);
      this.chartDataSet = true;
    });
  }

  navigateTo(i: number) {
    setTimeout(() => {
      this.document.getElementById('scrollIntoView').scrollIntoView({block: 'nearest'});
    })
    this.selectedTab.setValue(i);
  }

}

export interface TokenInfo {
  name?: string,
  address?: string,
  balance?: number,
  decimals?: number,
  totalSupply?: number,
  priceUsd?: number,
  image?: string,
  indexValueUsd?: number,
  targetValueUsd?: number,
  priceChange7d?: number,
  marketcapCoingecko?: number
}