import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalCaseFormComponent } from './legal-case-form.component';

describe('LegalCaseFormComponent', () => {
  let component: LegalCaseFormComponent;
  let fixture: ComponentFixture<LegalCaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalCaseFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalCaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
