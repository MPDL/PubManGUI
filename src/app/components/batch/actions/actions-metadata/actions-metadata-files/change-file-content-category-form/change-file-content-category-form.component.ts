import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeFileContentCategoryParams } from 'src/app/components/batch/interfaces/batch-params';
import { ContentCategories } from 'src/app/model/inge';

@Component({
  selector: 'pure-change-file-content-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-file-content-category-form.component.html',
})
export class ChangeFileContentCategoryFormComponent { 

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    public valSvc: BatchValidatorsService, 
    private batchSvc: BatchService,
    //private msgSvc: MessageService,
    @Inject(LOCALE_ID) public locale: string) {}

  contentCategories = Object.keys(ContentCategories).sort();
  contentCategoriesTranslations = {};
  contentCategoriesOptions: {value: string, option: string}[] = [];

  ngOnInit(): void { 
    this.loadTranslations(this.locale)
      .then(() => {
        this.contentCategories.forEach((value) => {
          let keyT = value as keyof typeof this.contentCategoriesTranslations;
          this.contentCategoriesOptions.push({'value': keyT, 'option': this.contentCategoriesTranslations[keyT]})
        })
      })
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.contentCategoriesTranslations = msgs.ContentCategories;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.contentCategoriesTranslations = msgs.ContentCategories;
      })
    } 
  }

  public changeFileContentCategoryForm: FormGroup = this.fb.group({
    fileContentCategoryFrom: [$localize`:@@batch.actions.metadata.files.contentCategory:Category`, [ Validators.required ]],
    fileContentCategoryTo: [$localize`:@@batch.actions.metadata.files.contentCategory:Category`, [ Validators.required ]],
  }, 
  { validators: [this.valSvc.notEqualsValidator('fileContentCategoryFrom','fileContentCategoryTo'), this.valSvc.allRequiredValidator()] });

  get changeFileContentCategoryParams(): ChangeFileContentCategoryParams {
    const actionParams: ChangeFileContentCategoryParams = {
      fileContentCategoryFrom: this.changeFileContentCategoryForm.controls['fileContentCategoryFrom'].value,
      fileContentCategoryTo: this.changeFileContentCategoryForm.controls['fileContentCategoryTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeFileContentCategoryForm.invalid) {
      this.changeFileContentCategoryForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeFileContentCategory(this.changeFileContentCategoryParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}
