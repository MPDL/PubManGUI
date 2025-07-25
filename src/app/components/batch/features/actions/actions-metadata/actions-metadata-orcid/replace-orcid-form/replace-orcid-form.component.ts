import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IdentifierVO, IdType, OrganizationVO, PersonVO } from 'src/app/model/inge';
import { PersonAutosuggestComponent } from 'src/app/components/shared/person-autosuggest/person-autosuggest.component';

import { BatchService } from 'src/app/components/batch/services/batch.service';

import type { ReplaceOrcidParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

import { ControlType } from 'src/app/services/form-builder.service'; // Adjust 

@Component({
  selector: 'pure-replace-orcid-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonAutosuggestComponent,
    TranslatePipe
  ],
  templateUrl: './replace-orcid-form.component.html',
})
export class ReplaceOrcidFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);

  public changeOrcidForm: FormGroup = this.fb.group<ControlType<PersonVO>>({
    completeName: this.fb.control(''),
    givenName: this.fb.control(''),
    familyName: this.fb.control(''),
    alternativeNames: this.fb.array<AbstractControl<string, string>>([]),
    titles: this.fb.array<AbstractControl<string, string>>([]),
    pseudonyms: this.fb.array<AbstractControl<string, string>>([]),
    organizations: this.fb.array<AbstractControl<OrganizationVO, OrganizationVO>>([]),
    identifier: this.fb.group<ControlType<IdentifierVO>>(
      {
        id: this.fb.control(''),
        type: this.fb.control(IdType.CONE),
      }
    ),
    orcid: this.fb.control(''),

  });

  get changeOrcidParams(): ReplaceOrcidParams {
    const actionParams: ReplaceOrcidParams = {
      creatorId: this.changeOrcidForm.controls['identifier'].value.id,
      orcid: this.changeOrcidForm.controls['orcid'].value,
      itemIds: []
    }
    return actionParams;
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
