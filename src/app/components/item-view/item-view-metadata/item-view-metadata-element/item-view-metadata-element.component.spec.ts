import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewMetadataElementComponent } from './item-view-metadata-element.component';

describe('ItemViewMetadataElementComponent', () => {
  let component: ItemViewMetadataElementComponent;
  let fixture: ComponentFixture<ItemViewMetadataElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemViewMetadataElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemViewMetadataElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
