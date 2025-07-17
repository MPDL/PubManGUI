import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ChangeKeywordsFormComponent } from './change-keywords-form/change-keywords-form.component';
import { ReplaceKeywordsFormComponent } from './replace-keywords-form/replace-keywords-form.component';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-replace-keywords',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChangeKeywordsFormComponent,
    ReplaceKeywordsFormComponent,
    TranslatePipe
  ],
  templateUrl: './replace-keywords.component.html',
})
export class ReplaceKeywordsComponent {

  fb = inject(FormBuilder);

  public _chooseMethodForm: FormGroup = this.fb.group({
    keywordsReplaceMethod: ['REPLACE_ALL', [Validators.required]],
  });

  public keywordsReplaceMethod: string = "REPLACE_ALL";


  ngOnInit(): void {
    this.onKeywordsReplaceMethodChanged();
  }

  onKeywordsReplaceMethodChanged(): void {
    this._chooseMethodForm.get('keywordsReplaceMethod')!.valueChanges
      // TO-DO pipe to reset forms
      .subscribe((method: string) => {
        this.keywordsReplaceMethod = method;
      });
  }
}
