import { TestBed } from '@angular/core/testing';

import { ItemSelectionService } from './item-selection.service';

describe('ItemSelectionServiceService', () => {
  let service: ItemSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
