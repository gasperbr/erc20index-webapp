import { TestBed } from '@angular/core/testing';

import { ContractaAddressService } from './contracta-address.service';

describe('ContractaAddressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractaAddressService = TestBed.get(ContractaAddressService);
    expect(service).toBeTruthy();
  });
});
