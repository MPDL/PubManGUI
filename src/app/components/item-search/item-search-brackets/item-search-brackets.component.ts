import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemSearchCriterionComponent } from '../item-search-criterion/item-search-criterion.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'pure-item-search-brackets',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ItemSearchCriterionComponent, JsonPipe],
  templateUrl: './item-search-brackets.component.html',
  styleUrl: './item-search-brackets.component.scss'
})
export class ItemSearchBracketsComponent implements OnInit {

  @Input() search_form!: FormGroup;
  @Input() array_index!: number;

  bracket_array!: FormGroup;
  fb = inject(FormBuilder);

  ngOnInit() {
    this.bracket_array = this.fb.group({
      brackets: this.fb.array([])
    });
    // this.addFieldToFormArray();
  }

  createFormGroup() {
    return this.fb.group({
      join: 'AND',
      filter: [],
      sub_filter: [],
    });
  }

  addFieldToFormArray(index: number) {
    this.brackets.insert(index, this.createFormGroup());
  }

  removeFieldFromFormArray(index: number) {
    this.brackets.removeAt(index);
  }

  notification(event: any, index: number) {
    if (event.value === 'add') {
      this.addFieldToFormArray(index);
    } else if (event.value === 'remove') {
      this.removeFieldFromFormArray(index);
    }
  }

  get brackets() {
    const fields = this.search_form.get('fields') as FormArray;
    return fields.controls[this.array_index]?.get('brackets') as FormArray;
  }

}
