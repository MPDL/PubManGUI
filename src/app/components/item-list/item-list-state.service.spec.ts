import { TestBed } from '@angular/core/testing';

import { ItemListStateService } from './item-list-state.service';

describe('ItemListStateService', () => {
  let service: ItemListStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemListStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
