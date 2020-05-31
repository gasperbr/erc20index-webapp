import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ContractService } from 'src/app/services/contract.service';
import { TokenInfo } from '../dashboard.component';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { History } from 'src/app/services/api.service';
import { ContractaAddressService } from 'src/app/services/contracta-address.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {

  @Input() usersProviderConnected: boolean;
  @Input() usersProviderExists: boolean;
  @Input() tokensInfo: TokenInfo[];
  @Input() usersFunds: {erci: number, dai: number};
  @Input() usersFundsRaw: {erci: number, dai: number};
  @Input() oldData: {erciPrice: number, supply: number, fundValue: number};
  @Input() initialHistory: History[];
  @Input() isVisible = true;

  @Output() updateValues = new EventEmitter();

  @ViewChild('daiInput', {static: false}) daiInput;
  @ViewChild('erciInput', {static: false}) erciInput;

  erciPrice: number;
  erciSupply: number;
  fundValue: number;
  
  erciPriceChange; // %
  erciSupplyChange; // %
  fundValueChange; // %

  displayedColumns: string[] = ['name', 'balance', 'currentValue', 'targetValue'];
  dataSource: {name: string, balance: number, currentValue: number, targetValue: number}[] = [];

  dataLoading = true;

  daiPriceUsd;

  chartTargetValuesData = {
    labels: [],
    currentValues: [],
    targetValues: [],
  };

  daiAmount = new FormControl(undefined, [Validators.min(0.01)]);
  erciAmount = new FormControl(undefined, [Validators.min(0)]);

  daiAmountMaxValue;
  erciAmountMaxValue;

  hash: string;
  
  constructor(
    private contractService: ContractService,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private contractAddress: ContractaAddressService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {

    if (changes.tokensInfo && changes.tokensInfo.currentValue && changes.tokensInfo.currentValue.length) {

      this.setInfo();

    } else if (changes.usersFunds && changes.usersFunds.currentValue) {

      this.daiAmountMaxValue = this.usersFunds.dai;
      this.erciAmountMaxValue = this.usersFunds.erci;
      console.log(this.erciAmountMaxValue); 
      
      this.daiAmount.setValidators([Validators.min(0.01), Validators.max(this.usersFunds.dai)])
      this.erciAmount.setValidators([Validators.min(0), Validators.max(this.usersFunds.erci)])

    } else if (changes.oldData && changes.oldData.currentValue) {

      this.updateChangesPercentages();

    }
  }

  setInfo() {

    this.dataLoading = true;
    setTimeout(() => this.dataLoading = false, 5000); // display error message?

    let fundValueSum = 0;

    this.chartTargetValuesData.labels = [];
    this.chartTargetValuesData.currentValues = [];
    this.chartTargetValuesData.targetValues = []
    
    this.daiPriceUsd = this.tokensInfo[this.tokensInfo.length - 1].priceUsd;
    // remove dai from list if index dai balance is 0
    // === doesn't work for some reason
    this.tokensInfo[this.tokensInfo.length - 1].balance == 0 && this.tokensInfo.pop();

    this.dataSource = this.tokensInfo.map((token) => {

      let currentValue = (token.balance / (10 ** token.decimals)) * token.priceUsd;
      fundValueSum += currentValue;

      this.chartTargetValuesData.labels.push(token.name);
      this.chartTargetValuesData.currentValues.push(currentValue);
      this.chartTargetValuesData.targetValues.push(token.targetValueUsd);
      
      return {
        name: token.name,
        balance: token.balance / (10 ** token.decimals),
        currentValue,
        targetValue: token.targetValueUsd,
        priceChange7d: token.priceChange7d
      };
    });

    this.fundValue = fundValueSum;

    this.getErciInfo();

    this.chartTargetValuesData = {...this.chartTargetValuesData}; // trigger change detection
      
  }

  updateChangesPercentages() {
    if (this.oldData) {
      if (this.erciPrice) {
        this.erciPriceChange = 100 * (this.erciPrice / this.oldData.erciPrice - 1);
      } else if (this.erciPrice === 0) {
        this.erciPriceChange = 0;
      }
      if (this.erciSupply) {
        this.erciSupplyChange = 100 * (this.erciSupply / this.oldData.supply - 1);
      } else if (this.erciSupply === 0) {
        this.erciSupplyChange = 0;
      }
      if (this.fundValue) {
        this.fundValueChange = 100 * (this.fundValue / this.oldData.fundValue - 1);
      } else if (this.fundValue === 0) {
        this.fundValueChange = 0;
      }
    }
  }

  getErciInfo() {
    this.contractAddress.address.pipe(filter(Boolean)).subscribe((address: string) => {
      this.contractService.getTotalSupplyOfErcTokens([address]).then(supply => {
        this.erciSupply = supply[0] / (10 ** 18);
        this.calculateIndexValue();
      });
    })
  }

  calculateIndexValue() {
    if (this.erciSupply >= 0 && this.fundValue >= 0) {
      this.erciPrice = this.erciSupply === 0 ? 0 : this.fundValue / this.erciSupply;
      this.dataLoading = false;
    }
    this.updateChangesPercentages();
  }

  setMaxValue(token) {
    token === 'dai' ? 
      this.daiAmount.setValue(this.daiAmountMaxValue) : 
      this.erciAmount.setValue(this.erciAmountMaxValue);
  }

  promptConnection() {
    this.contractService.promptUsersConnection();
  }

  buyErci() {
    
    if (this.daiAmount.valid && this.daiAmount.value) {

      let amount = this.daiAmount.value * (10 ** 18);

      if (this.daiAmount.value === this.usersFunds.erci) {
        amount = this.usersFundsRaw.dai;
      }

      this.contractService.buyErciwithDaiGasEstimate(amount).then(gas => {
        this.buy(amount, gas + 50000);
      }, (err) => {console.error(err); this.buy(amount, 1600000);});

    } else { // just focus to input instead of showing error if value isn't defined
      this.daiInput.nativeElement.focus();
    }
  }

  buy(amount, gas) {
    console.log(amount, gas);
    this.contractService.buyErciwithDai(amount, gas).on('transactionHash', (hash) => {
      this.setHash(hash);
    }).on('receipt', (receipt) => {
      this.setHash(undefined);
      this.updateUI();
    }).on('error', err => this.error(err));
    this.contractService.setDaiAllowance(amount);
  }

  sellErci() {
    if (this.erciAmount.valid && this.erciAmount.value) {

      let amount = this.erciAmount.value * (10 ** 18);

      if (this.erciAmount.value === this.usersFunds.erci) {
        amount = this.usersFundsRaw.erci; // will be more percise than this.usersFundsRounded (can be badly rounded)
      }

      this.contractService.sellErciForDaiGasEstimate(amount).then(gas => {
        this.sell(amount, gas + 50000);
      }, (err) => {console.error(err); this.sell(amount, 1600000);});

    } else {
      this.erciInput.nativeElement.focus();
    }
  }
  
  sell(amount, gas) {
    
    this.contractService.sellErciForDai(amount, gas).on('transactionHash', (hash) => {
      this.setHash(hash);
    }).on('receipt', (receipt) => {
      this.setHash(undefined);
      this.updateUI();
    }).on('error', err => this.error(err));
    this.contractService.setErciAllowance(amount);
  }

  setHash(hash) {
    this.hash = hash;
    this.ref.detectChanges();
  }
  
  updateUI() {
    this.hash = undefined;
    this._snackBar.open('Transaction confirmed!', undefined, {duration: 2000});
    this.updateValues.emit();
    this.dataLoading = true;
    this.ref.detectChanges();
  }

  error(err) {
    this.hash = undefined;
    if (err && err.code === 4001) { // rejected by user - don't show message
    } else {
      this._snackBar.open('Transaction failed!', undefined, {duration: 2000});
      this.ref.detectChanges();
    }
  }

}
