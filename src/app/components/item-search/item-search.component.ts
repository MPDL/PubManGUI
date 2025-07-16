import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AaService } from 'src/app/services/aa.service';
// import { public_filter } from 'src/app/isis/model/pure_queries';
import {
  bool_query,
  bracketed_search_criterion,
  fieldOptions,
  join_enum,
  search_criterion
} from 'src/app/model/pure_search';
import { ConeService } from 'src/app/services/cone.service';
import { ItemSearchCriterionComponent } from './item-search-criterion/item-search-criterion.component';
import { AsyncPipe, JsonPipe, NgStyle } from '@angular/common';

@Component({
  selector: 'pure-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgStyle, ItemSearchCriterionComponent, AsyncPipe, JsonPipe]
})
export class ItemSearchComponent implements OnInit, OnDestroy {

  private destroyed: Subject<boolean> = new Subject();
  result: any;
  saved: any;
  cone_results: any;
  public cone_async: Observable<any> | undefined;

  dynamicForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private aa: AaService,
    private router: Router,
    private cone_svc: ConeService
  ) { }

  ngOnInit() {
    this.dynamicForm = this.fb.group({
      fields: this.fb.array([])
    });
    this.addFieldToFormArray(0);
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  createFormGroup() {
    return this.fb.group(search_criterion);
  }

  addFieldToFormArray(index: number) {
    this.fields.insert(index + 1, this.createFormGroup());
  }

  removeFieldFromFormArray(index: number) {
    this.fields.removeAt(index);
  }

  add_remove_brackets(event: any) {
    if (event.action === 'remove') {
      this.removeFieldFromFormArray(event.index);
    }
  }

  notification(event: any, index: number) {
    if (event.value === 'add') {
      this.addFieldToFormArray(index);
    } else if (event.value === 'remove') {
      this.removeFieldFromFormArray(index);
    } else if (event.value === 'brackets') {
      this.fields.removeAt(index);
      //this.fields.insert(index, this.fb.group({inherit: event.control.value.join, brackets: this.fb.array([this.createFormGroup()])}));
      //this.fields.at(index).patchValue({join: event.control.value.join, bracket: 'open'});
      this.fields.insert(index, this.fb.group({ join: 'AND', bracket: 'open' }));
      this.fields.insert(index + 1, this.fb.group(bracketed_search_criterion));
      this.fields.insert(index + 2, this.fb.group({ join: 'AND', bracket: 'close' }));
    }
  }

  indent(index: number) {
    const open = this.fields.controls.findIndex(c => c.get('bracket')?.value === 'open');
    const close = this.fields.controls.findIndex(c => c.get('bracket')?.value === 'close');
    if (open < index && index < close) {
      return { 'margin-left': '15%' }
    }
    return undefined;
  }

  form_to_query(ctrls: AbstractControl[]) {
    const boolquery: bool_query = {
      bool: {}
    };
    /*
    if (!this.aa.token) {
      boolquery.bool['filter'] = public_filter;
    }
    */
    return ctrls.reduce((q: bool_query, control) => {
      if (control.get('bracket')) {
        const bracketed = this.get_in_between();
        this.form_to_query(bracketed);
      } else {

        const { join, filter, sub_filter, value, hidden_id, from, to } = control.value;
        const clause = join_enum[join];
        if (!q.bool[clause]) {
          q.bool[clause] = [];
        }
        const query = fieldOptions.find((fo: { label: string; }) => fo.label.localeCompare(filter) === 0);
        if (filter.localeCompare('Person') === 0) {
          if (hidden_id) {
            q.bool[(clause)].push(query?.query(sub_filter, hidden_id));
          } else {
            value ? q.bool[clause].push(query?.alt_query(sub_filter, value)) : null;
          }
        } else if (filter.localeCompare('Organization') === 0) {
          if (hidden_id) {
            q.bool[clause].push(query?.query(hidden_id));
          } else {
            value ? q.bool[clause].push(query?.alt_query(value)) : null;
          }
        } else if (filter.localeCompare('Genre') === 0) {
          sub_filter ? q.bool[clause].push(query?.query(sub_filter)) : null;
        } else if (filter.localeCompare('Date') === 0) {
          let from_val, to_val;
          if (from) {
            from_val = from;
          }
          if (to) {
            to_val = to;
          }
          q.bool[clause].push(query?.query(from_val, to_val));
        } else {
          value ? q.bool[clause].push(query?.query(value)) : null;
        }
      }
      return q;
    }, boolquery)
  }

  get_in_between() {
    const open = this.fields.controls.findIndex(c => c.get('bracket')?.value === 'open');
    const close = this.fields.controls.findIndex(c => c.get('bracket')?.value === 'close');
    const in_between = this.fields.controls.slice(open + 1, close);
    return in_between;
  }

  show_query() {
    const query = this.form_to_query(this.fields.controls);
    if (query.bool['should']) {
      query.bool['minimum_should_match'] = 1;
    }
    this.result = query;
  }

  show_form() {
    this.result = this.dynamicForm.value;
  }

  search() {
    const query = this.form_to_query(this.fields.controls);
    if (query.bool['should']) {
      query.bool['minimum_should_match'] = 1;
    }
    this.router.navigateByUrl('/', { state: { query } });
  }

  reset() {
    this.saved = this.dynamicForm.value;
    this.result = undefined;
    this.cone_results = undefined;
    // this.dynamicForm.reset({fields: []});
    this.ngOnInit();
  }

  undo() {
    this.dynamicForm = this.fb.group({ 'fields': this.fb.array([]) });
    this.saved.fields.forEach((element: any) => {
      this.fields.push(this.fb.group(element));
    });
  }

  list_cone(value: string) {
    const params = new HttpParams();
    params.append('format', 'json');
    params.append('q', value);
    this.cone_results = this.cone_svc.find(`/${value}`);
  }

  get fields() {
    return this.dynamicForm.get('fields') as FormArray;
  }

}
