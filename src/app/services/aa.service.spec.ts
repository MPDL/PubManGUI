import { TestBed } from '@angular/core/testing';

import { AaService } from './aa.service';

describe('AaService', () => {
  let service: AaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
