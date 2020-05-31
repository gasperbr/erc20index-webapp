import { Component, OnInit, ViewChild, AfterViewInit, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TokenInfo } from '../dashboard.component';
import { environment } from 'src/environments/environment';
import { ContractaAddressService } from 'src/app/services/contracta-address.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnChanges {

  @Input() tokensInfo: TokenInfo[];
  numberOfTokens = ' ';
  combinedValue = '';
  address;

  tokensContract: TokenInfo[];
  tokensCoingecko: TokenInfo[];

  constructor(
    private contractAddress: ContractaAddressService
  ) { }

  ngOnInit() {
    this.contractAddress.address.pipe(filter(Boolean)).subscribe(address => {
      this.address = address;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tokensInfo) {
      this.tokensCoingecko = this.orderByCoingeckoMarketcap(changes.tokensInfo.currentValue);
      this.tokensContract = changes.tokensInfo.currentValue;
    }
  }

  getValue(tokens: TokenInfo[]) {
    let value = 0;
    tokens.forEach(token => {
      value += token.indexValueUsd;
    });
    return value;
  }

  orderByCoingeckoMarketcap(tokens: TokenInfo[]) {
    return [...tokens].sort((a,b) => b.marketcapCoingecko - a.marketcapCoingecko);
  }

}
