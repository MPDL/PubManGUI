import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlType } from "src/app/components/item-edit/services/form-builder.service";
import { IdentifierVO, IdType, OrganizationVO, PersonVO } from 'src/app/model/inge';
import { ConePersonsDirective } from 'src/app/deprecated/selector/services/cone-persons/cone-persons.directive';
import {
  ConePersonsService,
  PersonResource
} from 'src/app/deprecated/selector/services/cone-persons/cone-persons.service';
import { SelectorComponent } from "src/app/deprecated/selector/selector.component";
import { OptionDirective } from 'src/app/deprecated/selector/directives/option.directive';

import { BatchService } from 'src/app/components/batch/services/batch.service';

import type { ReplaceOrcidParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-replace-orcid-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConePersonsDirective,
    SelectorComponent,
    OptionDirective,
    TranslatePipe
  ],
  templateUrl: './replace-orcid-form.component.html',
})
export class ReplaceOrcidFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);
  cone = inject(ConePersonsService);

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
        id: this.fb.control('', [ Validators.required ]),
        type: this.fb.control(IdType.CONE),
      }
    ),
    orcid: this.fb.control('', [ Validators.required ]),

  });

  get changeOrcidParams(): ReplaceOrcidParams {
    const actionParams: ReplaceOrcidParams = {
      creatorId: this.changeOrcidForm.controls['identifier'].value.id,
      orcid: this.changeOrcidForm.controls['orcid'].value,
      itemIds: []
    }
    return actionParams;
  }

  updatePerson(event: any) {
    this.cone.resource(event.id).subscribe(
      (person: PersonResource) => {
        const patched: Partial<PersonVO> = {
          completeName: person.http_xmlns_com_foaf_0_1_family_name + ', ' + person.http_xmlns_com_foaf_0_1_givenname,
          givenName: person.http_xmlns_com_foaf_0_1_givenname,
          familyName: person.http_xmlns_com_foaf_0_1_family_name,
          identifier: {
            type: IdType.CONE,
            id: person.id.substring(person.id.lastIndexOf('/') + 1),
          },
        };

        if (Array.isArray(person.http_purl_org_dc_elements_1_1_identifier)) {
          const additionalIDs = person.http_purl_org_dc_elements_1_1_identifier.filter(identifier => identifier.http_www_w3_org_2001_XMLSchema_instance_type.includes(IdType.DOI));
          patched.orcid = additionalIDs[0].http_www_w3_org_1999_02_22_rdf_syntax_ns_value;
        } else {
          if (person.http_purl_org_dc_elements_1_1_identifier.http_www_w3_org_2001_XMLSchema_instance_type.includes(IdType.ORCID)) {
            patched.orcid = person.http_purl_org_dc_elements_1_1_identifier.http_www_w3_org_1999_02_22_rdf_syntax_ns_value;
          }
        };

        this.changeOrcidForm.patchValue(patched, { emitEvent: false });
      });
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
