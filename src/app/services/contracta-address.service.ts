import { Injectable } from '@angular/core';
import { Subject, pipe, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContractaAddressService {

  public address: BehaviorSubject<string> = new BehaviorSubject(undefined);

  setAddress(address: string) {
    this.address.next(address);
  }

}
