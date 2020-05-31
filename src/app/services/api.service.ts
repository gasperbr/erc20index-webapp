import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getHistory(from?, to?) {
    if (from && to) {
      return this.http.get<History[]>(`https://erc20index.herokuapp.com/api/history?from=${from}&to=${to}`);
    } else {
      return this.http.get<History[]>('https://erc20index.herokuapp.com/api/history');
    }
  }
}

export interface History {
  createdAt: number;
  usdValue: number;
  tokenPrice: number;
  tokenBalances: {
    coingeckoId: string;
    balance: number;
  }[];
}
