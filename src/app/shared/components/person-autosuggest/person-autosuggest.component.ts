import {Component, Input, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbHighlight, NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap, tap
} from "rxjs";
import {ConeService} from "../../../services/cone.service";
import {HttpParams} from "@angular/common/http";
import { FormBuilderService } from 'src/app/components/item-edit/services/form-builder.service';
import { ConePersonsService } from '../selector/services/cone-persons/cone-persons.service';
import { IdType, OrganizationVO, PersonVO } from 'src/app/model/inge';

@Component({
  selector: 'pure-person-autosuggest',
  standalone: true,
  imports: [
    NgbTypeahead,
    ReactiveFormsModule,
    NgbHighlight,
    CommonModule
  ],
  templateUrl: './person-autosuggest.component.html',
  styleUrl: './person-autosuggest.component.scss'
})
export class PersonAutosuggestComponent {


  @Input() formForPersonsCompleteName? : FormControl;
  @Input() formForPersonsGivenName? : FormControl;
  @Input() formForPersonsFamilyName? : FormControl;
  @Input() formForPersonOrganizations! : FormArray;

  @Input() formForPersonsId! : FormControl | undefined;

  cone = inject(ConePersonsService);
  
  searching: boolean = false;

  constructor(private coneService: ConeService, private fb: FormBuilder, private fbs: FormBuilderService) {
  }
  
  suggestPersons: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      filter(typed => (typed != null && typed.length >= 3)),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        const params = new HttpParams().set('q', term).set('format', 'json');
        return this.coneService.find('/persons/query', params).pipe(
          /*
          map(response => {
              return response.map((hit: any) => hit.value);
            }
          ),

           */

          //tap(() => (this.searchFailed = false)),
          catchError(() => {
            //this.searchFailed = true;
            this.searching = false;
            return of([]);
          }),
        )
      }),
      tap(() => (this.searching = false)),
    );


  suggestPersonsSelector= (event: any) => {
    //console.log("setOU" + JSON.stringify(event));
    const coneId = event.item.id.substring(event.item.id.indexOf("/persons/"), event.item.id.length)
    if(this.formForPersonsId) {
      this.formForPersonsId.setValue(coneId);
    }
    console.log("Item",JSON.stringify(event.item));
    if(this.formForPersonsCompleteName) {
      this.formForPersonsCompleteName.setValue(event.item.value);
    }
    if(this.formForPersonsGivenName) {
      this.formForPersonsGivenName.setValue(event.item.value.substring(event.item.value.indexOf(", ") + 2, event.item.value.indexOf("(")));
    }
    if(this.formForPersonsFamilyName) {
      this.formForPersonsFamilyName.setValue(event.item.value.substring(0, event.item.value.indexOf(", ")));
    }
    console.log("formForPersonOrganization before set",this.formForPersonOrganizations?.value);
    if(this.formForPersonOrganizations) {
      // this.formForPersonOrganizations.push(event.item.value.substring(event.item.value.indexOf("(") + 1, event.item.value.indexOf(")")));
      this.formForPersonOrganizations.push(this.fbs.organization_FG({
        identifier: "test",
        name: event.item.value.substring(event.item.value.indexOf("(") + 1, event.item.value.indexOf(")"))
      }));
    } else {
      this.formForPersonOrganizations = this.fb.array([this.fbs.organization_FG(null)]);
      this.formForPersonOrganizations.insert(event.index + 1, this.fbs.organization_FG(null));
    }
    console.log("formForPersonOrganization after set",this.formForPersonOrganizations?.value);

    this.updatePerson(coneId, event.item.value.substring(event.item.value.indexOf("(") + 1, event.item.value.indexOf(")")));

    //Prevent that the whole ou object is set in the form control
    event.preventDefault();
  }

  updatePerson(coneId: string, ouName: string) {
    const selected_person = ouName;
    const selected_ou = selected_person.substring(selected_person.indexOf('(') + 1, selected_person.lastIndexOf(','));
    console.log("Selected:", selected_person, selected_ou)
    console.log("ConeId", coneId)
    this.cone.resource("cone/" + coneId).subscribe(
      (person: PersonResource) => {
        const patched: Partial<PersonVO> = {
          givenName: person.http_xmlns_com_foaf_0_1_givenname,
          familyName: person.http_xmlns_com_foaf_0_1_family_name,
          identifier: {
            type: IdType.CONE,
            id: person.id.substring(24)
          }
        }
        //this.person.patchValue(patched, { emitEvent: false });
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
        console.log("OU", ou_id, ou_name)
        const patched_ou: OrganizationVO = {
          identifier: ou_id,
          name: ou_name
        }
        this.formForPersonOrganizations.clear();
        this.formForPersonOrganizations.push(this.fbs.organization_FG(patched_ou));
      });
  }

  deleteFields() {
    if(this.formForPersonsCompleteName) {
      this.formForPersonsCompleteName.setValue('');
    }
    if(this.formForPersonsGivenName) {
      this.formForPersonsGivenName.setValue('');
    }
    if(this.formForPersonsFamilyName) {
      this.formForPersonsFamilyName.setValue('');
    }
    console.log("formForPersonOrganization before delete",this.formForPersonOrganizations?.value);
    if(this.formForPersonOrganizations) {
      this.formForPersonOrganizations.clear();
    }
    console.log("formForPersonOrganization after delete",this.formForPersonOrganizations?.value);
    this.formForPersonsId?.setValue('');
  }


  
}

export interface PersonResource {
  id: string,
  http_purl_org_escidoc_metadata_terms_0_1_degree: string,
  http_purl_org_dc_elements_1_1_title: string,
  http_xmlns_com_foaf_0_1_givenname: string,
  http_purl_org_escidoc_metadata_terms_0_1_position: position_shite[] | position_shite,
  http_xmlns_com_foaf_0_1_family_name: string,
  http_purl_org_dc_terms_alternative: string,
  http_purl_org_dc_elements_1_1_identifier: identifier_bunch[] | identifier_bunch
}

export interface position_shite {
  http_purl_org_escidoc_metadata_terms_0_1_position_name: string,
  http_purl_org_eprint_terms_affiliatedInstitution: string,
  http_purl_org_dc_elements_1_1_identifier: string,
}

export interface identifier_bunch { 
  http_www_w3_org_1999_02_22_rdf_syntax_ns_value: string,
  http_www_w3_org_2001_XMLSchema_instance_type: string
}