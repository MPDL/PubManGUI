import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { EMPTY, Observable, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { fieldOptions, join_enum } from 'src/app/model/pure_search';
import { ConeService } from 'src/app/services/cone.service';
import { OptionDirective } from 'src/app/shared/components/selector/directives/option.directive';
import { PureOusDirective } from 'src/app/shared/components/selector/services/pure_ous/pure-ous.directive';
import { SelectorComponent } from 'src/app/shared/components/selector/selector.component';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { CreatorRole, IdType, MdsPublicationGenre } from 'src/app/model/inge';
import {OrganizationSearchCriterion} from "../../item-search-advanced/criterions/StringOrHiddenIdSearchCriterion";

// const valid_date_old = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;
export const valid_date = /^((?:19|20)[0-9][0-9])(?:(?:-(0[1-9]|1[012]))(?:-(0[1-9]|[12][0-9]|3[01]))?)?$/;


export function mustOrNot(regExp: RegExp, must: boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const test = regExp.test(control.value);
    if (must) {
      return (!test) ? { mustOrNot: { value: control.value } } : null;
    } else {
      return test ? { mustOrNot: { value: control.value } } : null;
    }
  };
}

@Component({
  selector: 'pure-item-search-criterion',
  templateUrl: './item-search-criterion.component.html',
  styleUrls: ['./item-search-criterion.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, ClickOutsideDirective, SelectorComponent, PureOusDirective, OptionDirective, AsyncPipe]
})
export class ItemSearchCriterionComponent {

  @Input() isc_form!: FormGroup;
  @Input() array_index!: number;
  @Output() notice = new EventEmitter<any>;

  public cone_async: Observable<any> | undefined;

  joinOptions = Object.keys(join_enum);

  fieldOptions = fieldOptions;

  personOptions = Object.keys(CreatorRole);

  identifierOptions = Object.keys(IdType);

  genreOptions = Object.keys(MdsPublicationGenre);

  public selectedField: string | undefined;
  public selectedJoin: string | undefined;

  constructor(
    private fb: FormBuilder,
    private cone_svc: ConeService,
  ) { }

  currentField(val: string) {
    this.selectedField = val;
    if (val.includes('Date')) {
      this.addFromTo();
    } else if (!val.includes('Genre')) {
      this.addInputValue();
    }
    if (val.includes('Person')) {
      this.async_auto('/persons/');
    }
  }

  join(val: string) {
    this.selectedJoin = val;
  }

  get brackets() {
    return this.isc_form.get('bracket') as FormControl;
  }

  get first_in_brackets() {
    return this.isc_form.get('first_in_brackets')?.value;
  }

  getFormControl(validator: ValidatorFn | null) {
    return this.fb.control(null, validator);
  }

  addInputValue() {
    this.isc_form.addControl('value', this.getFormControl(null));
  }

  addHiddenId() {
    this.isc_form.addControl('hidden_id', this.getFormControl(null));
  }

  addFromTo() {
    this.isc_form.addControl('from', this.getFormControl(mustOrNot(valid_date, true)));
    this.isc_form.addControl('to', this.getFormControl(null));
    this.onChanges(this.isc_form.get('to'));
  }

  async_auto(resource: string) {
    this.cone_async = this.isc_form.valueChanges.pipe(
      filter(typed => (typed.value != null && typed.value.length >= 3)),
      distinctUntilChanged(),
      debounceTime(500),
      // tap(() => this.cone_result_list = []),
      switchMap(result => this.cone_svc.find(resource + result.value)),
      // takeUntil(this.destroyed)
    )
  }

  select_person(cone: any) {
    this.addHiddenId();
    this.isc_form.patchValue({value: cone.value, hidden_id: cone.id.slice(24) }, { emitEvent: false });
    this.cone_async = EMPTY;
  }

  select_ou(ou: any) {
    this.addHiddenId();
    this.isc_form.patchValue({ hidden_id: ou.id }, { emitEvent: false });
  }

  addFieldToFormArray() {
    this.notice.emit({ value: 'add' });
  }

  removeFieldFromFormArray() {
    this.notice.emit({ value: 'remove', control: this.isc_form });
  }

  addBracketsToFormArray() {
    this.notice.emit({ value: 'brackets', control: this.isc_form });
  }

  close_cone() {
    this.cone_async = EMPTY;
  }

  onChanges(control: AbstractControl | null) {
    control!.valueChanges.subscribe((value) => {
      if (value) {
        control?.setValidators(mustOrNot(valid_date, true));
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity({emitEvent: false});
    });
  }

}
