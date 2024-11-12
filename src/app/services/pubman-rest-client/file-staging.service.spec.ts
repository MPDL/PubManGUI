import { TestBed } from '@angular/core/testing';

import { FileStagingService } from './file-staging.service';

describe('FileStagingService', () => {
  let service: FileStagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileStagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
