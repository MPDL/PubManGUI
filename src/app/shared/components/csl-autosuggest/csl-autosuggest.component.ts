import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { HttpParams } from "@angular/common/http";
import { ConeService } from "../../../services/cone.service";
import { FormBuilderService } from "../../../components/item-edit/services/form-builder.service";
import { EmptyPipe } from "../../services/pipes/empty.pipe";

@Component({
  selector: 'pure-csl-autosuggest',
  standalone: true,
  imports: [NgbTypeahead, ReactiveFormsModule, EmptyPipe, FormsModule],
  templateUrl: './csl-autosuggest.component.html',
  styleUrl: './csl-autosuggest.component.scss'
})
export class CslAutosuggestComponent {

  @Input() selectedCslName : string = '';
  @Input() selectedCslId : string = '';

  @Output() selectedEvent = new EventEmitter<any>()



  searching: boolean = false;

  constructor(private coneService: ConeService, private fb: FormBuilder, private fbs: FormBuilderService) {

  }

  suggestCsl: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      filter(typed => (typed != null && typed.length >= 3)),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        const params = new HttpParams().set('q', term).set('format', 'json');
        return this.coneService.find('/citation-styles/query', params).pipe(
          catchError(() => {
            this.searching = false;
            return of([]);
          }),
        )
      }),
      tap(() => (this.searching = false)),
    );

  suggestCslFormatter= (cslEntry: any) => {
    //console.log("setOU" + JSON.stringify(ou));
    if (typeof cslEntry === 'object')
      return cslEntry.value;
    return cslEntry;
  }

  suggestCslSelector= (event: any) => {
    console.log("setCsl" + JSON.stringify(event));

    this.selectedCslId = event.item.id;
    this.selectedCslName = event.item.value;

    event.preventDefault();
    this.selectedEvent.emit(event.item);
  }


  deleteFields() {
    this.selectedCslId = '';
    this.selectedCslName = '';
    this.selectedEvent.emit({});
    //this.formForCslName.setValue('');
    //this.formForCslId?.setValue('');
  }

}
