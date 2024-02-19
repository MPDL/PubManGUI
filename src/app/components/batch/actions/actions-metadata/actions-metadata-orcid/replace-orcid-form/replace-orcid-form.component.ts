import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Type, inject } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ControlType } from "src/app/components/item-edit/services/form-builder.service";
import { IdType, IdentifierVO, PersonVO, OrganizationVO } from 'src/app/model/inge';
import { ConePersonsDirective } from 'src/app/shared/components/selector/services/cone-persons/cone-persons.directive';
import { ConePersonsService, PersonResource } from 'src/app/shared/components/selector/services/cone-persons/cone-persons.service';
import { SelectorComponent } from "../../../../../../shared/components/selector/selector.component";
import { OptionDirective } from 'src/app/shared/components/selector/directives/option.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pure-replace-orcid-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConePersonsDirective,  
    SelectorComponent,
    OptionDirective
  ],
  templateUrl: './replace-orcid-form.component.html',
})
export class ReplaceOrcidFormComponent {

  @Output() notice = new EventEmitter();

  cone = inject(ConePersonsService);

  constructor(private fb: FormBuilder) { }

  // changeOrcid(List<String> itemIds, String creatorId, String orcid, String userId, String token);
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

  updatePerson(event: any) {
    this.cone.resource(event.id).subscribe(
      (person: PersonResource) => {
        const patched: Partial<PersonVO> = {
          completeName: person.http_xmlns_com_foaf_0_1_family_name + ', ' + person.http_xmlns_com_foaf_0_1_givenname,
          givenName: person.http_xmlns_com_foaf_0_1_givenname,
          familyName: person.http_xmlns_com_foaf_0_1_family_name,
          identifier: {
            type: IdType.CONE,
            id: person.id.substring(34)
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

  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors
      && form.controls[field].touched;
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'A value is required!';

        case 'minlength':
          return `At least ${errors['minlength'].requiredLength} characters required!`;
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.changeOrcidForm.invalid) {
      this.changeOrcidForm.markAllAsTouched();
      return;
    }

    console.log(this.changeOrcidForm.value);
  }

 }
