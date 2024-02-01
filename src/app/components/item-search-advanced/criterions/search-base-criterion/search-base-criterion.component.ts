import {Component, EventEmitter, Input, Output, Type} from '@angular/core';
import {SearchCriterion} from "../SearchCriterion";
import {AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ItemSearchComponent} from "../../../item-search/item-search.component";
import {NgFor, NgIf} from "@angular/common";
import {TitleSearchCriterion} from "../standard/TitleSearchCriterion";

@Component({
  selector: 'pure-search-base-criterion',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './search-base-criterion.component.html',
  styleUrl: './search-base-criterion.component.scss'
})
export class SearchBaseCriterionComponent {

  //protected readonly SearchType = SearchType;

  @Input() searchForm!: FormGroup;
  @Input() criterion!: SearchCriterion;
  @Input() index: number = 0;

  //@Output("addSearchCriterion") addSearchCriterion: EventEmitter<any> = new EventEmitter();




  ngOnInit() {
    //this.formGroup = this.criterion.initForm();
    //(<FormArray>this.searchForm.get("formArrayFields")).insert(this.index, this.formGroup);
  }


  addCriterion() {
    //this.addSearchCriterion(index+1, new TitleSearchCriterion());
  }

  removeCriterion() {

  }


}
