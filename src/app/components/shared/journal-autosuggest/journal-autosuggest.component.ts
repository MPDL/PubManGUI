import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
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

@Component({
  selector: 'pure-journal-autosuggest',
  imports: [
    FormsModule,
    NgbTypeahead,
    TranslatePipe,
    ReactiveFormsModule,
    BootstrapValidationDirective
  ],
  templateUrl: './journal-autosuggest.component.html',
  styleUrl: './journal-autosuggest.component.scss'
})
export class JournalAutosuggestComponent {
  @Input() type: string ="DDC";
  @Input() formForJournalTitle!: FormControl;
  @Input() addQuotesForSearch:boolean = false;

  @Output() journalSelected = new EventEmitter();

  //language = computed(() => {return this.translateSvc.currentLang}); //language that will be searched for the search term (e.g. en, de [ISO639-1])
  searching: boolean = false;
  selected: boolean = false;


  //  constructor(private coneService: ConeService, private fb: FormBuilder, private fbs: FormBuilderService) {
  constructor(private coneService: ConeService, private translateSvc: TranslateService) {

  }

  suggest: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        const params = new HttpParams().set('q', term).set('format', 'json');

        const coneType = this.type.valueOf().replaceAll("_","-").toLowerCase();
        return this.coneService.find('/journals/query', params).pipe(
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
    this.formForJournalTitle?.setValue(value);
    this.selected = true;

    const coneId = event.item.id.substring(event.item.id.lastIndexOf("/cone/") + 5, event.item.id.length)

    this.journalSelected.emit(coneId);
    //Prevent that the whole ou object is set in the form control
    event.preventDefault();
  }

  resultFormatter(item: any) {
    return item.value;
  }

  deleteFields() {
    this.formForJournalTitle.setValue('');
    this.selected = false;
  }
}
