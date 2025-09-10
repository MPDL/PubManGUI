import { Component, computed, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ConeService } from "../../../services/cone.service";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable, of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import { HttpParams } from "@angular/common/http";
import { SubjectClassification } from "../../../model/inge";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";

@Component({
  selector: 'pure-classification-autosuggest',
  imports: [
    FormsModule,
    NgbTypeahead,
    TranslatePipe,
    ReactiveFormsModule,
    BootstrapValidationDirective
  ],
  templateUrl: './classification-autosuggest.component.html',
  styleUrl: './classification-autosuggest.component.scss'
})
export class ClassificationAutosuggestComponent {
  @Input() type: string ="DDC";
  @Input() formForClassification!: FormControl;
  @Input() addQuotesForSearch:boolean = false;

  //language = computed(() => {return this.translateSvc.currentLang}); //language that will be searched for the search term (e.g. en, de [ISO639-1])
  searching: boolean = false;
  selected: boolean = false;


  //  constructor(private coneService: ConeService, private fb: FormBuilder, private fbs: FormBuilderService) {
  constructor(private coneService: ConeService, private translateSvc: TranslateService) {

  }


  suggestLanguage: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        const params = new HttpParams().set('q', term).set('format', 'json');

        const coneType = this.type.valueOf().replaceAll("_","-").toLowerCase();
        return this.coneService.find('/' + coneType + '/query', params).pipe(
          map(response => {
              console.log('ResponseSuggest', response)
              return response.map((hit: any) => hit.value);
            }
          ),
          catchError(() => {
            this.searching = false;
            return of([]);
          }),
        )
      }),
      tap(() => (this.searching = false)),
    );

  suggestClassificationSelector = (event: any) => {
    /*
    console.log("set Language" + JSON.stringify(event.item));
    if (this.formForClassification) {
      this.formForClassification.setValue((event.item.substring(0, 3)).trim());
    }

     */
    let value = event.item;
    if(this.addQuotesForSearch) {
      value = '"' + value + '"'
    }

    this.formForClassification?.setValue(value);

    this.selected = true;
    //Prevent that the whole ou object is set in the form control
    event.preventDefault();
  }

  deleteFields() {
    this.formForClassification.setValue('');
    this.selected = false;
  }
}
