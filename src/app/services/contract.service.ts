import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { ERCINDEXABI } from '../../abi/ercIndexAbi';
import { ERC20ABI } from '../../abi/erc20Abi';
import { BehaviorSubject } from 'rxjs';
import { pluck, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SwitchNetworkModalComponent } from '../components/switch-network-modal/switch-network-modal.component';
import { ContractaAddressService } from './contracta-address.service';
import BigNumber from "bignumber.js";

declare global {
  interface Window { ethereum: any; web3: any}
}
@Injectable({
  providedIn: 'root'
})
export class ContractService {

  ercIndexContract: any;
  daiContract: any;
  web3: Web3;

  private usersProviderConnectedState$ = new BehaviorSubject<{exists: boolean, connected: boolean}>({
    exists: false,
    connected: false
  });

  readonly usersProviderExists$ = this.usersProviderConnectedState$.asObservable().pipe(pluck('exists'));
  readonly usersProviderConnected$ = this.usersProviderConnectedState$.asObservable().pipe(pluck('connected'));
  usersAddress;

  constructor(
    public dialog: MatDialog,
    private addressService: ContractaAddressService
  ) {

    this.setDefaultProvider();

    if (window.ethereum) {
      // user has an ethereum provider
      
      this.usersProviderConnectedState$.next({exists: true, connected: false});
            
      this.promptUsersConnection();

    }
  }

  promptUsersConnection() {
    
    if (window.ethereum && window.ethereum.networkVersion) {

      if (window.ethereum.networkVersion !== environment.network) {

        this.switchNetwork();

      } else {
 
        this.enableWeb3();

      }
    }
  }

  switchNetwork() {
    this.openDialog();
  }

  enableWeb3() {
    window.ethereum.enable().then(() => {
      
      this.web3 = new Web3(window.ethereum);
      
      this.usersProviderConnectedState$.next({exists: true, connected: true});
      
      this.setContracts();

    }).catch(rejection => {});
  }

  setDefaultProvider() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(environment.infuraProvider));
    this.setContracts();
  }

  setContracts() {

    this.addressService.address.pipe(filter(Boolean)).subscribe((address: string) => {

      this.ercIndexContract = new this.web3.eth.Contract(ERCINDEXABI, address);
      
      if (this.usersProviderConnectedState$.value.connected) {
        this.daiContract = new this.web3.eth.Contract(ERC20ABI, environment.daiTokenAddress);
      }
      
    });
  }

  // reads top token addresses of index
  readTopTokens() {

    return new Promise((resolve, reject) => {
      
      this.ercIndexContract.methods.topTokensLength().call().then((length) => {
        
        const promisesArray = [];
        
        for(let i = 0; i < length; i++) {
          promisesArray.push(this.ercIndexContract.methods.topTokens(i).call());
        }

        Promise.all(promisesArray).then(result => { // result is array of addresses
          resolve(result);
        });
      });
    });
  }

  getErcTokensInfo(tokenAddress: string[], ownerAddress: string) {
    return Promise.all([
      this.getBalanceOfErcTokens(tokenAddress, ownerAddress),
      this.getDecimalsOfErcTokens(tokenAddress),
      this.getTotalSupplyOfErcTokens(tokenAddress)
    ]);
  }

  getBalanceOfErcTokens(tokenAddresses: string[], ownerAddress: string) {
    const promisesArray = [];
    tokenAddresses.forEach(tokenAddress => {
      promisesArray.push((new this.web3.eth.Contract(ERC20ABI, tokenAddress)).methods.balanceOf(ownerAddress).call());
    });
    return Promise.all(promisesArray);
  }

  getDecimalsOfErcTokens(tokenAddresses: string[]) {
    const promisesArray = [];
    tokenAddresses.forEach(tokenAddress => {
      promisesArray.push((new this.web3.eth.Contract(ERC20ABI, tokenAddress)).methods.decimals().call());
    });
    return Promise.all(promisesArray);
  }

  getTotalSupplyOfErcTokens(tokenAddresses: string[]) {
    const promisesArray = [];
    tokenAddresses.forEach(tokenAddress => {
      promisesArray.push((new this.web3.eth.Contract(ERC20ABI, tokenAddress)).methods.totalSupply().call());
    });
    return Promise.all(promisesArray);
  }

  setDaiAllowance(amount: number) {
    this.addressService.address.pipe(filter(Boolean)).subscribe(address => {
      return this.daiContract.methods.approve(
        address, this.web3.utils.toHex(amount)).send({from: this.usersAddress}
      );
    });
  }

  buyErciwithDaiGasEstimate(amount: number) {
    return this.ercIndexContract.methods.buyERCIWithDai(this.web3.utils.toHex(amount)).estimateGas({
      from: this.usersAddress,
      gasPrice: 1
    });
  }

  buyErciwithDai(amount: number, gas: number) {
    return this.ercIndexContract.methods.buyERCIWithDai(this.web3.utils.toHex(amount)).send({
      from: this.usersAddress,
      gas
    });
  }

  setErciAllowance(amount: number) {
    this.addressService.address.pipe(filter(Boolean)).subscribe(address => {
      return this.ercIndexContract.methods.approve(
        address, this.web3.utils.toHex(amount)).send({from: this.usersAddress}
      );
    });
  }

  sellErciForDaiGasEstimate(amount: number) {
    return this.ercIndexContract.methods.sellERCIforDai(this.web3.utils.toHex(amount)).estimateGas({
      from: this.usersAddress,
      gasPrice: 1
    });
  }

  sellErciForDai(amount: number, gas) {
    return this.ercIndexContract.methods.sellERCIforDai(this.web3.utils.toHex(amount)).send({
      from: this.usersAddress,
      gas: gas
    });
  }

  getUsersFunds() {
    return new Promise((resolve, reject) => {

      this.web3.eth.getAccounts().then(accounts => {

        if (!accounts[0]) {
          return;
        }

        this.usersAddress = accounts[0];

        this.addressService.address.pipe(filter(Boolean)).subscribe((address: string) => {

          this.getBalanceOfErcTokens(
            [address, environment.daiTokenAddress], accounts[0]
          ).then(balances => {
            console.log(balances);
            resolve({
              raw: {
                erci: balances[0],
                dai: balances[1],
              },
              rounded: {
                erci: balances[0] / 10 ** 18,
                dai: balances[1] / 10 ** 18
              }
            });
          });
        });
      });
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SwitchNetworkModalComponent, {
      width: '350px',
      data: {targetNetwork: environment.network},
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {});
    // metamask will refresh browser
  }

}
