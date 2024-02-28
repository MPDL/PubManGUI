import {Component, Input} from '@angular/core';
import {NgbHighlight, NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {catchError, debounceTime, distinctUntilChanged, map, Observable, of, OperatorFunction, switchMap} from "rxjs";
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

  constructor(private coneService: ConeService) {
  }

  suggestPersons: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      //tap(() => (this.searching = true)),
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
            return of([]);
          }),
        )
      })
            //tap(() => (this.searching = false)),
    );

  suggestPersonsFormatter= (ou: any) => {
    //console.log("setOU" + JSON.stringify(ou));
    if (typeof ou === 'object')
      return ou.value
    return ou;
  }

  suggestPersonsSelector= (event: any) => {
    //console.log("setOU" + JSON.stringify(event));
    if(this.formForPersonsId) {
      this.formForPersonsId.setValue(event.item.id);
    }
    this.formForPersonsName.setValue(event.item.value);

    //Prevent that the whole ou object is set in the form control
    event.preventDefault();
  }



}
