import {Component, Input} from '@angular/core';
import {NgbHighlight, NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
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
import {OrganizationsService} from "../../../services/organizations.service";
import {ConeService} from "../../../services/cone.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'pure-person-autosuggest',
  standalone: true,
  imports: [
    NgbTypeahead,
    ReactiveFormsModule,
    NgbHighlight
  ],
  templateUrl: './person-autosuggest.component.html',
  styleUrl: './person-autosuggest.component.scss'
})
export class PersonAutosuggestComponent {


  @Input() formForPersonsName! : FormControl;
  @Input() formForPersonsId! : FormControl;
  searching: boolean = false;

  constructor(private coneService: ConeService) {
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

  suggestPersonsFormatter= (person: any) => {
    //console.log("setOU" + JSON.stringify(ou));
    if (typeof person === 'object')
      return person.value
    return person;
  }

  suggestPersonsSelector= (event: any) => {
    //console.log("setOU" + JSON.stringify(event));
    if(this.formForPersonsId) {
      const coneId = event.item.id.substring(event.item.id.indexOf("/persons/"), event.item.id.length)
      this.formForPersonsId.setValue(coneId);
    }
    this.formForPersonsName.setValue(event.item.value);

    //Prevent that the whole ou object is set in the form control
    event.preventDefault();
  }


  deleteFields() {
    this.formForPersonsName.setValue('');
    this.formForPersonsId?.setValue('');
  }
}
