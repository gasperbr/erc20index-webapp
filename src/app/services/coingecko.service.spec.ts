import { TestBed } from '@angular/core/testing';

import { CoingeckoService } from './coingecko.service';

describe('CoingeckoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoingeckoService = TestBed.get(CoingeckoService);
    expect(service).toBeTruthy();
  });
});
