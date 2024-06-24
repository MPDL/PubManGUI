import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { IdentifierFormComponent } from '../identifier-form/identifier-form.component';
import { CreatorRole, CreatorType, IdType, IdentifierVO, OrganizationVO, PersonVO } from 'src/app/model/inge';
import { SelectorComponent } from 'src/app/shared/components/selector/selector.component';
import { PureOusDirective } from 'src/app/shared/components/selector/services/pure_ous/pure-ous.directive';
import { OptionDirective } from 'src/app/shared/components/selector/directives/option.directive';
import { ConePersonsDirective } from 'src/app/shared/components/selector/services/cone-persons/cone-persons.directive';
import { ConePersonsService, PersonResource } from 'src/app/shared/components/selector/services/cone-persons/cone-persons.service';
import { AddRemoveButtonsComponent } from '../../../../shared/components/add-remove-buttons/add-remove-buttons.component';
import { PersonAutosuggestComponent } from 'src/app/shared/components/person-autosuggest/person-autosuggest.component';

@Component({
  selector: 'pure-creator-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IdentifierFormComponent, AddRemoveButtonsComponent, SelectorComponent, PureOusDirective, ConePersonsDirective, OptionDirective, PersonAutosuggestComponent],
  templateUrl: './creator-form.component.html',
  styleUrls: ['./creator-form.component.scss']
})
export class CreatorFormComponent {

  @Input() creator_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();

  fbs = inject(FormBuilderService);
  cone = inject(ConePersonsService);

  creator_types = Object.keys(CreatorType);
  creator_roles = Object.keys(CreatorRole);

  get type() {
    return this.creator_form.get('type') as FormControl<ControlType<CreatorType>>;
  }

  type_change(val: string) {
    if (val.localeCompare('ORGANIZATION') === 0) {
      // this.organizations.clear();
      // this.organizations.push(this.fbs.organization_FG(null))
      this.creator_form.get('organization')?.enable();
      this.creator_form.get('person')?.reset();
      this.creator_form.get('person')?.disable();
      this.creator_form.get('role')?.reset();
    } else {
      this.creator_form.get('person')?.enable();
      this.creator_form.get('organization')?.reset();
      this.creator_form.get('organization')?.disable();
      this.creator_form.get('role')?.reset();
    }
  }

  updateOU(event: any) {
    this.organization.patchValue({ identifier: event.id }, { emitEvent: false });
  }

  updatePerson(event: any) {
    const selected_person = event.selected as string;
    const selected_ou = selected_person.substring(selected_person.indexOf('(') + 1, selected_person.lastIndexOf(','));
    this.cone.resource(event.id).subscribe(
      (person: PersonResource) => {
        const patched: Partial<PersonVO> = {
          givenName: person.http_xmlns_com_foaf_0_1_givenname,
          familyName: person.http_xmlns_com_foaf_0_1_family_name,
          identifier: {
            type: IdType.CONE,
            id: person.id.substring(24)
          }
        }
        this.person.patchValue(patched, { emitEvent: false });
        let ou_id = '', ou_name = '';
        if (Array.isArray(person.http_purl_org_escidoc_metadata_terms_0_1_position)) {
          const ou_2_display = person.http_purl_org_escidoc_metadata_terms_0_1_position.filter(ou => ou.http_purl_org_eprint_terms_affiliatedInstitution.includes(selected_ou));
          if (ou_2_display && ou_2_display.length === 1) {
            ou_id = ou_2_display[0].http_purl_org_dc_elements_1_1_identifier;
            ou_name = ou_2_display[0].http_purl_org_eprint_terms_affiliatedInstitution;
          }
        } else {
          ou_id = person.http_purl_org_escidoc_metadata_terms_0_1_position.http_purl_org_dc_elements_1_1_identifier;
          ou_name = person.http_purl_org_escidoc_metadata_terms_0_1_position.http_purl_org_eprint_terms_affiliatedInstitution;
        }
        const patched_ou: OrganizationVO = {
          identifier: ou_id,
          name: ou_name
        }
        this.organizations.clear();
        this.organizations.push(this.fbs.organization_FG(patched_ou));
      });
  }

  updatePersonOU(event: any, index: number) {
    this.organizations.at(index).patchValue({ identifier: event.id }, { emitEvent: false });
  }

  get organization() {
    return this.creator_form.get('organization') as FormGroup<ControlType<OrganizationVO>>;
  }

  get person() {
    return this.creator_form.get('person') as FormGroup<ControlType<PersonVO>>;
  }

  get organizations() {
    //console.log("person.organizations:", this.creator_form.get('person.organizations') as FormArray<FormGroup<ControlType<OrganizationVO>>>)
    return this.creator_form.get('person.organizations') as FormArray<FormGroup<ControlType<OrganizationVO>>>;
   
  }

  get identifier() {
    return this.creator_form.get('person.identifier') as FormGroup<ControlType<IdentifierVO>>;
  }

  /*
  addPersonOU() {
    this.organizations.push(this.fbs.organization_FG(null));
  }

  removePersonOU(i: number) {
    this.organizations.removeAt(i);
  }
  */

  add_remove_person_ou(event: any) {
    if (event.action === 'add') {
      this.organizations.insert(event.index + 1, this.fbs.organization_FG(null));
    } else if (event.action === 'remove') {
      this.organizations.removeAt(event.index);
    }
  }

  handleIdentifierNotification(event: any) {
    console.log(event)
  }

  /*
  addCreator() {
    this.notice.emit('add');
  }

  removeCreator() {
    this.notice.emit('remove');
  }
  */

  add_remove_creator(event: any) {
    this.notice.emit(event);
  }

}
