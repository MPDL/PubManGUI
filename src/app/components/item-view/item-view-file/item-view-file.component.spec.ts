import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewFileComponent } from './item-view-file.component';

describe('ItemViewFileComponent', () => {
  let component: ItemViewFileComponent;
  let fixture: ComponentFixture<ItemViewFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemViewFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemViewFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
