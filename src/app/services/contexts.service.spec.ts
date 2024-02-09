import { TestBed } from '@angular/core/testing';

import { ContextsService } from './contexts.service';

describe('ContextsService', () => {
  let service: ContextsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
