import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishingInfoFormComponent } from './publishing-info-form.component';

describe('PublishingInfoFormComponent', () => {
  let component: PublishingInfoFormComponent;
  let fixture: ComponentFixture<PublishingInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishingInfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishingInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
