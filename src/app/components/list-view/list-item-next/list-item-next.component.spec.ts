import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemNextComponent } from './list-item-next.component';

describe('ListItemNextComponent', () => {
  let component: ListItemNextComponent;
  let fixture: ComponentFixture<ListItemNextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItemNextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListItemNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
