import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbHighlight, NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { ConeService } from "../../../services/cone.service";
import {
  catchError,
  debounceTime,
  distinctUntilChanged, finalize,
  map,
  Observable, of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import { HttpParams } from "@angular/common/http";
import { SubjectClassification } from "../../../model/inge";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";
import { ValidationErrorMessageDirective } from "../../../directives/validation-error-message.directive";

@Component({
  selector: 'pure-cone-autosuggest',
  imports: [
    FormsModule,
    NgbTypeahead,
    TranslatePipe,
    ReactiveFormsModule,
    BootstrapValidationDirective,
    ValidationErrorMessageDirective,
    NgbHighlight
  ],
  templateUrl: './cone-autosuggest.component.html',
  styleUrl: './cone-autosuggest.component.scss'
})
export class ConeAutosuggestComponent {
  @Input() coneType: string ="DDC";
  @Input() form!: FormControl;
  @Input() addQuotesForSearch:boolean = false;
  @Input() lockIfFilled:boolean = true;
  @Input() additionalLockElements: HTMLInputElement[] = [];

  @Output() valueSelected = new EventEmitter();

  //language = computed(() => {return this.translateSvc.currentLang}); //language that will be searched for the search term (e.g. en, de [ISO639-1])
  searching: boolean = false;
  selected: boolean = false;
  //  constructor(private coneService: ConeService, private fb: FormBuilder, private fbs: FormBuilderService) {
  constructor(private coneService: ConeService, private translateSvc: TranslateService) {

  }

  ngOnInit() {
    if(this.form && this.form.value) {
      this.selected = true;
      this.disableFields();

    }
  }

  suggest: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        const params = new HttpParams().set('q', term).set('format', 'json');

        const coneType = this.coneType.valueOf().replaceAll("_","-").toLowerCase();
        return this.coneService.find('/' + coneType + '/query', params).pipe(
          catchError(() => {
            return [];
          }),
        )
      }),
      finalize(() => (this.searching = false)),
    );

  suggestSelector = (event: any) => {
    let value = event.item.value;
    if(this.addQuotesForSearch) {
      value = '"' + value + '"'
    }
    this.form?.setValue(value);
    this.disableFields();
    this.selected = true;

    const coneId = event.item.id.substring(event.item.id.lastIndexOf("/cone/") + 5, event.item.id.length)
    event.item.parsedId = coneId;

    this.valueSelected.emit(event.item);

    //Prevent that the whole return object is set in the form control
    event.preventDefault();
  }

  resultFormatter(item: any) {
    return item.value;
  }

  deleteFields() {

    this.form.setValue('');
    this.enableFields();
    this.selected = false;
    this.valueSelected.emit(undefined);
  }

  disableFields() {
    if(this.lockIfFilled)
    {
      this.additionalLockElements.forEach(inputElement => {
        inputElement.readOnly = true;
      })
    }
  }

  enableFields() {
    if(this.lockIfFilled)
    {
      this.additionalLockElements.forEach(inputElement => {
        inputElement.readOnly = false;
      })
    }
  }


}
