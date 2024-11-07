import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewCreatorsComponent } from './item-view-creators.component';

describe('ItemViewCreatorsComponent', () => {
  let component: ItemViewCreatorsComponent;
  let fixture: ComponentFixture<ItemViewCreatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemViewCreatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemViewCreatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
