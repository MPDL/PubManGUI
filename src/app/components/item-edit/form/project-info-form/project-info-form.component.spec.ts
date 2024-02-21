import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoFormComponent } from './project-info-form.component';

describe('ProjectInfoFormComponent', () => {
  let component: ProjectInfoFormComponent;
  let fixture: ComponentFixture<ProjectInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectInfoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
