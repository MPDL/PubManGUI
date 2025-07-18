import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { CreatorRole, CreatorType, IdentifierVO, IdType, OrganizationVO, PersonVO } from 'src/app/model/inge';
import { SelectorComponent } from 'src/app/deprecated/selector/selector.component';
import { PureOusDirective } from 'src/app/deprecated/selector/services/pure_ous/pure-ous.directive';
import { OptionDirective } from 'src/app/deprecated/selector/directives/option.directive';
import {
  ConePersonsService,
  PersonResource
} from 'src/app/deprecated/selector/services/cone-persons/cone-persons.service';
import {
  AddRemoveButtonsComponent
} from '../../../shared/add-remove-buttons/add-remove-buttons.component';
import { OuAutosuggestComponent } from 'src/app/components/shared/ou-autosuggest/ou-autosuggest.component';
import { PersonAutosuggestComponent } from 'src/app/components/shared/person-autosuggest/person-autosuggest.component';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import { Errors } from 'src/app/model/errors';
import { environment } from 'src/environments/environment';
import { CdkDragHandle } from "@angular/cdk/drag-drop";

@Component({
  selector: 'pure-creator-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent, SelectorComponent, PureOusDirective, OptionDirective, PersonAutosuggestComponent, OuAutosuggestComponent, CdkDragHandle],
  templateUrl: './creator-form.component.html',
  styleUrls: ['./creator-form.component.scss']
})
export class CreatorFormComponent {

  @Input() creator_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();

  coneService = inject(ConePersonsService);
  fbs = inject(FormBuilderService);
  miscellaneousService = inject(MiscellaneousService);

  creator_roles = Object.keys(CreatorRole);
  creator_types = Object.keys(CreatorType);

  error_types = Errors;

  cone_uri = environment.cone_instance_uri;


  get type() {
    return this.creator_form.get('type') as FormControl<ControlType<CreatorType>>;
  }

  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }

  get identifier() {
    return this.creator_form.get('person.identifier') as FormGroup<ControlType<IdentifierVO>>;
  }

  get organization() {
    return this.creator_form.get('organization') as FormGroup<ControlType<OrganizationVO>>;
  }

  get organizations() {
    //console.log("person.organizations:", this.creator_form.get('person.organizations') as FormArray<FormGroup<ControlType<OrganizationVO>>>)
    return this.creator_form.get('person.organizations') as FormArray<FormGroup<ControlType<OrganizationVO>>>;
  }

  get person() {
    return this.creator_form.get('person') as FormGroup<ControlType<PersonVO>>;
  }

  type_change(event : Event ) {
    const val = (<HTMLInputElement>event.target).value;
    console.log('type: ', val);
    console.log('val.localeCompare("ORGANIZATION") === 0', val.localeCompare('ORGANIZATION') === 0)
    if (val?.localeCompare('ORGANIZATION') === 0) {
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
    this.coneService.resource(event.id).subscribe(
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
    this.creator_form.updateValueAndValidity();
  }

  handleIdentifierNotification(event: any) {
    console.log(event);
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
    this.creator_form.updateValueAndValidity();
  }

}
