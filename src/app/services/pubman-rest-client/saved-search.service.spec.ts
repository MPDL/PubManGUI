import { TestBed } from '@angular/core/testing';

import { SavedSearchService } from './saved-search.service';

describe('SavedSearchService', () => {
  let service: SavedSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
