import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeExternalReferenceContentCategoryParams } from 'src/app/components/batch/interfaces/batch-params';
import { ContentCategories } from 'src/app/model/inge';

@Component({
  selector: 'pure-change-external-reference-content-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-external-reference-content-category-form.component.html',
})
export class ChangeExternalReferenceContentCategoryFormComponent {
  
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


  public changeExternalReferenceContentCategoryForm: FormGroup = this.fb.group({
    externalReferenceContentCategoryFrom: [$localize`:@@batch.actions.metadata.extRef.contentCategory:Category`, [ Validators.required ]],
    externalReferenceContentCategoryTo: [$localize`:@@batch.actions.metadata.extRef.contentCategory:Category`, [ Validators.required ]],
  }, 
  { validators: [this.valSvc.notEqualsValidator('externalReferenceContentCategoryFrom','externalReferenceContentCategoryTo'), this.valSvc.allRequiredValidator()] });

  get changeExternalReferenceContentCategoryParams(): ChangeExternalReferenceContentCategoryParams {
    const actionParams: ChangeExternalReferenceContentCategoryParams = {
      externalReferenceContentCategoryFrom: this.changeExternalReferenceContentCategoryForm.controls['externalReferenceContentCategoryFrom'].value,
      externalReferenceContentCategoryTo: this.changeExternalReferenceContentCategoryForm.controls['externalReferenceContentCategoryTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeExternalReferenceContentCategoryForm.invalid) {
      this.changeExternalReferenceContentCategoryForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeExternalReferenceContentCategory(this.changeExternalReferenceContentCategoryParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }

 }
