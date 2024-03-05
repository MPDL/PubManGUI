import {Component, Input} from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import {OrganizationsService} from "../../../services/organizations.service";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-ou-autosuggest',
  standalone: true,
  imports: [NgbTypeahead, ReactiveFormsModule],
  templateUrl: './ou-autosuggest.component.html',
  styleUrl: './ou-autosuggest.component.scss'
})
export class OuAutosuggestComponent {

  @Input() formForOuName! : FormControl;
  @Input() formForOuId! : FormControl;

  searching: boolean = false;

  constructor(private organizationsService: OrganizationsService) {
  }

  suggestOus: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.organizationsService.elastic('/ous', this.ouAutoSuggestElasticQuery(term)).pipe(
          map(response => {
              return response.hits.hits.map((hit: any) => hit._source);
            }
          ),
          //tap(() => (this.searchFailed = false)),
          catchError(() => {
            //this.searchFailed = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searching = false)),
    );

  suggestOusFormatter= (ou: any) => {
    //console.log("setOU" + JSON.stringify(ou));
    if (typeof ou === 'object')
      return ou.namePath.join(', ');
    return ou;
  }

  suggestOusSelector= (event: any) => {
    //console.log("setOU" + JSON.stringify(event));
    if(this.formForOuId) {
      this.formForOuId.setValue(event.item.objectId);
    }
    this.formForOuName.setValue(event.item.namePath.join(', '));

    //Prevent that the whole ou object is set in the form control
    event.preventDefault();
  }

  ouAutoSuggestElasticQuery(searchString: string) {
    return {
      "query":
        {
          "multi_match":
            {
              "query": searchString,
              "type": "bool_prefix",
              "fields":
                [
                  "metadata.name.autosuggest",
                  "metadata.name.autosuggest._2gram",
                  "metadata.name.autosuggest._3gram",
                  "metadata.alternativeNames.autosuggest",
                  "metadata.alternativeNames.autosuggest._2gram",
                  "metadata.alternativeNames.autosuggest._3gram"
                ]
            }
        }
    }
  }

  deleteFields() {
    this.formForOuName.setValue('');
    this.formForOuId?.setValue('');
  }

}
