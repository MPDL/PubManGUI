import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IdentifierVO, IdType, OrganizationVO, PersonVO } from 'src/app/model/inge';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ReplaceOrcidParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

import { PersonAutosuggestComponent } from 'src/app/components/shared/person-autosuggest/person-autosuggest.component';
import { ControlType } from 'src/app/services/form-builder.service';
import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-replace-orcid-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonAutosuggestComponent,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './replace-orcid-form.component.html',
})
export class ReplaceOrcidFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);

  validationError: boolean = false;

  public changeOrcidForm: FormGroup = this.fb.group<ControlType<PersonVO>>({
    completeName: this.fb.nonNullable.control(''), 
    givenName: this.fb.nonNullable.control(''),
    familyName: this.fb.nonNullable.control(''),
    alternativeNames: this.fb.array<AbstractControl<string, string>>([]),
    titles: this.fb.array<AbstractControl<string, string>>([]),
    pseudonyms: this.fb.array<AbstractControl<string, string>>([]),
    organizations: this.fb.array<AbstractControl<OrganizationVO, OrganizationVO>>([]),
    identifier: this.fb.group<ControlType<IdentifierVO>>(
      {
        id: this.fb.nonNullable.control(''),
        type: this.fb.nonNullable.control(IdType.CONE),
      }
    ),
    orcid: this.fb.nonNullable.control('')
  }, {validators: Validators.required});

  get changeOrcidParams(): ReplaceOrcidParams {
    const actionParams: ReplaceOrcidParams = {
      creatorId: this.changeOrcidForm.controls['identifier'].value.id,
      orcid: this.changeOrcidForm.controls['orcid'].value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit() {
    this.changeOrcidForm.valueChanges.subscribe(value => {    
      if (!this.changeOrcidForm.get('familyName')?.value) {
        this.changeOrcidForm.setErrors({ 'required': true });
      } 
    });
  }

  checkIfAllRequired() {
    if (!this.changeOrcidForm.get('familyName')?.value) {
      this.changeOrcidForm.markAsPending();
    } 
  }

  onSubmit(): void {
    if (this.changeOrcidForm.invalid) {
      this.changeOrcidForm.markAllAsTouched();
      return;
    }

    this.batchSvc.replaceOrcid(this.changeOrcidParams).subscribe( actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }

}
