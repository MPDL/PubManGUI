import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeFileVisibilityParams } from 'src/app/components/batch/interfaces/actions-params';
import { Visibility } from 'src/app/model/inge';


@Component({
  selector: 'pure-change-file-visibility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-file-visibility-form.component.html',
})
export class ChangeFileVisibilityFormComponent {

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private msgSvc: MessageService,
    @Inject(LOCALE_ID) public locale: string) {}

  visibility = Object.keys(Visibility);
  visibilityTranslations = {};
  visibilityOptions: {value: string, option: string}[] = [];

  ngOnInit(): void { 
    this.loadTranslations(this.locale)
      .then(() => {
        this.visibility.forEach((value) => {
          let keyT = value as keyof typeof this.visibilityTranslations;
          this.visibilityOptions.push({'value': keyT, 'option': this.visibilityTranslations[keyT]})
        })
      })
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.visibilityTranslations = msgs.Visibility;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.visibilityTranslations = msgs.Visibility;
      })
    } 
  }

  public changeFileVisibilityForm: FormGroup = this.fb.group({
    fileVisibilityFrom: [$localize`:@@batch.actions.metadata.files.visibility:Visibility`, [Validators.required]],
    fileVisibilityTo: [$localize`:@@batch.actions.metadata.files.visibility:Visibility`, [Validators.required]],
  }, 
  { validators: this.validSvc.notEqualsValidator('fileVisibilityFrom','fileVisibilityTo') });

  get changeFileVisibilityParams(): ChangeFileVisibilityParams {
    const actionParams: ChangeFileVisibilityParams = {
      fileVisibilityFrom: this.changeFileVisibilityForm.controls['fileVisibilityFrom'].value,
      fileVisibilityTo: this.changeFileVisibilityForm.controls['fileVisibilityTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeFileVisibilityForm.invalid) {
      this.changeFileVisibilityForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeFileVisibility(this.changeFileVisibilityParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
    });
  }
}
