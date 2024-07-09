import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, OperatorFunction, switchMap, tap, } from 'rxjs';
import { ConeService } from 'src/app/services/cone.service';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {  NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pure-language-autosuggest',
  standalone: true,
  imports: [CommonModule, NgbTypeahead, ReactiveFormsModule],
  templateUrl: './language-autosuggest.component.html',
  styleUrl: './language-autosuggest.component.scss'
})
export class LanguageAutosuggestComponent {

  @Input() iso!: string;
  @Input() formForLanguage!: FormControl;

  searching: boolean = false;
  selected: boolean = false;

  //  constructor(private coneService: ConeService, private fb: FormBuilder, private fbs: FormBuilderService) {
  constructor(private coneService: ConeService) {
  }


  suggestLanguage: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        const params = new HttpParams().set('q', term).set('format', 'json');
        return this.coneService.find('/' + this.iso + '/query', params).pipe(
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

  suggestLanguageSelector = (event: any) => {
    console.log("set Language" + JSON.stringify(event.item));
    if (this.formForLanguage) {
      this.formForLanguage.setValue((event.item.substring(0, 3)).trim());
    }
    this.selected = true;
    //Prevent that the whole ou object is set in the form control
    event.preventDefault();
  }

  deleteFields() {
    this.formForLanguage.setValue('');
    this.selected = false;
  }
}
