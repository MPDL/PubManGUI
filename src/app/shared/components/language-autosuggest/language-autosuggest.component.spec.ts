import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageAutosuggestComponent } from './language-autosuggest.component';

describe('LanguageAutosuggestComponent', () => {
  let component: LanguageAutosuggestComponent;
  let fixture: ComponentFixture<LanguageAutosuggestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageAutosuggestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageAutosuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
