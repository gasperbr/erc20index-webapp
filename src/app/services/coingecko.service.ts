import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {

  baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(
    private http: HttpClient
  ) { }

  getTokenInfoFromAddress(tokens: string[]) {
    
    tokens = this.convertAddressesFromRopstenToMainnet(tokens);

    let observableArray = [];

    tokens.forEach(token => {
      observableArray.push(this.http.get(this.baseUrl + `/coins/ethereum/contract/${token}`));
    });

    return forkJoin(observableArray);
  }

  convertAddressesFromRopstenToMainnet(tokens: string[]) {
    return tokens.map(token => {
      token = token.toUpperCase();

      if (token === '0XF22E3F33768354C9805D046AF3C0926F27741B43') {

        return '0xe41d2489571d322189246dafa5ebde1f4699f498'; /// ZRX

      } else if (token === '0XF9BA5210F91D0474BD1E1DCDAEC4C58E359AAD85') {

        return '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'; // MKR

      } else if (token === '0XB4F7332ED719EB4839F091EDDB2A3BA309739521') {
        
        return '0X514910771AF9CA656AF840DFF83E8264ECF986CA'; // LINK

      } else if (token === '0X7B2810576AA1CCE68F2B118CEF1F36467C648F92') {
        
        return '0XDD974D5C2E2928DEA5F71B9825B8B646686BD200'// KNC

      } else if (token === '0X4BFBA4A8F28755CB2061C413459EE562C6B9C51B' || 
                 token === '0X879884C3C46A24F56089F3BBBE4D5E38DB5788C0') {
        
        return '0XD26114CD6EE289ACCF82350C8D8487FEDB8A0C07'; // OMG

      } else if (token === '0XDB0040451F373949A4BE60DCD7B6B8D6E42658B6' ||
                 token === '0XDA5B056CFB861282B4B59D29C9B395BCC238D29B') {
        
        return '0X0D8775F648430679A709E98D2B0CB6250D2887EF'; // BAT

      } else if (token === '0XAD6D458402F60FD3BD25163575031ACDCE07538D' ||
                 token === '0X2448EE2641D78CC42D7AD76498917359D961A783') {

        return '0X6B175474E89094C44DA98B954EEDEAC495271D0F'; // DAI

      } else {
        return token;
      }
    });
  }
}
