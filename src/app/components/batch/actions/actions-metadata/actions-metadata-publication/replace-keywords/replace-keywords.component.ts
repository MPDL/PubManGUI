import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { ChangeKeywordsFormComponent } from './change-keywords-form/change-keywords-form.component';
import { ReplaceKeywordsFormComponent } from './replace-keywords-form/replace-keywords-form.component';

@Component({
  selector: 'pure-replace-keywords',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChangeKeywordsFormComponent,
    ReplaceKeywordsFormComponent
  ],
  templateUrl: './replace-keywords.component.html',
})
export class ReplaceKeywordsComponent {

  constructor(private fb: FormBuilder) { }

  public _chooseMethodForm: FormGroup = this.fb.group({
    keywordsReplaceMethod: ['REPLACE_ALL', [ Validators.required ]],
  });

  public keywordsReplaceMethod: string = "REPLACE_ALL";


  ngOnInit(): void {
    this.onKeywordsReplaceMethodChanged();
  }

  onKeywordsReplaceMethodChanged(): void {
    this._chooseMethodForm.get('keywordsReplaceMethod')!.valueChanges
      // TO-DO pipe to reset forms
      .subscribe( (method: string) => {
        this.keywordsReplaceMethod = method;
      });
  }
 }
