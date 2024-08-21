import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeReviewMethodParams } from 'src/app/components/batch/interfaces/actions-params';
import { ReviewMethod } from 'src/app/model/inge';

@Component({
  selector: 'pure-change-review-method-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-review-method-form.component.html',
})
export class ChangeReviewMethodFormComponent {

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private msgSvc: MessageService,
    @Inject(LOCALE_ID) public locale: string) {}

    reviewMethods = Object.keys(ReviewMethod);
    reviewMethodsTranslations = {};
    reviewMethodssOptions: {value: string, option: string}[] = [];
  
    ngOnInit(): void { 
      this.loadTranslations(this.locale)
        .then(() => {
          this.reviewMethods.forEach((value) => {
            let keyT = value as keyof typeof this.reviewMethodsTranslations;
            this.reviewMethodssOptions.push({'value': keyT, 'option': this.reviewMethodsTranslations[keyT]})
          })
        })
    }
  
    async loadTranslations(lang: string) {
      if (lang === 'de') {
        await import('src/assets/i18n/messages.de.json').then((msgs) => {
          this.reviewMethodsTranslations = msgs.ReviewMethod;
        })
      } else {
        await import('src/assets/i18n/messages.json').then((msgs) => {
          this.reviewMethodsTranslations = msgs.ReviewMethod;
        })
      } 
    }  

  public changeReviewMethodForm: FormGroup = this.fb.group({
    reviewMethodFrom: [$localize`:@@batch.actions.metadata.publication.reviewType:Review type`, [ Validators.required ]],
    reviewMethodTo: [$localize`:@@batch.actions.metadata.publication.reviewType:Review type`, [ Validators.required ]],
  }, 
  { validators: this.validSvc.notEqualsValidator('reviewMethodFrom','reviewMethodTo') });

  get changeReviewMethodParams(): ChangeReviewMethodParams {
    const actionParams: ChangeReviewMethodParams = {
      reviewMethodFrom: this.changeReviewMethodForm.controls['reviewMethodFrom'].value,
      reviewMethodTo: this.changeReviewMethodForm.controls['reviewMethodTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeReviewMethodForm.invalid) {
      this.changeReviewMethodForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeReviewMethod(this.changeReviewMethodParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
    });
  }
 }
