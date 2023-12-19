import { TestBed } from '@angular/core/testing';

import { IngeCrudService } from './inge-crud.service';

describe('IngeCrudService', () => {
  let service: IngeCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngeCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
