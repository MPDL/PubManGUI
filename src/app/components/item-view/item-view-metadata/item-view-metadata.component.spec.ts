import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewMetadataComponent } from './item-view-metadata.component';

describe('ItemViewMetadataComponent', () => {
  let component: ItemViewMetadataComponent;
  let fixture: ComponentFixture<ItemViewMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemViewMetadataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemViewMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
