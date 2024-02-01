import {Component, Input} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AaService} from "../../services/aa.service";
import {Router} from "@angular/router";
import {ConeService} from "../../services/cone.service";
import {SearchBaseCriterionComponent} from "./criterions/search-base-criterion/search-base-criterion.component";
import {AsyncPipe, JsonPipe, NgFor, NgIf} from "@angular/common";
import {TitleSearchCriterion} from "./criterions/standard/TitleSearchCriterion";
import {SearchCriterion} from "./criterions/SearchCriterion";
import {LogicalOperator} from "./criterions/operators/LogicalOperator";
import {DisplayType, searchTypes, searchTypesI} from "./criterions/search_config";

@Component({
  selector: 'pure-item-search-advanced',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, NgFor, NgIf, SearchBaseCriterionComponent, JsonPipe
  ],
  templateUrl: './item-search-advanced.component.html',
  styleUrl: './item-search-advanced.component.scss'
})
export class ItemSearchAdvancedComponent {

  searchForm!: FormGroup;
  criterions: SearchCriterion[] = [];

  result: any;

  searchTypeKeys: string[] = Object.keys(searchTypes);

  protected readonly DisplayType = DisplayType;

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) {


  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      fields: this.fb.array([])
    });

    this.appendSearchCriterion(new TitleSearchCriterion());
    this.appendSearchCriterion(new TitleSearchCriterion());



  }

  changeType(index: number, newType: string) {
    console.log("Change criterion at index " + index + " to type " + newType);

    const newSearchCriterion: SearchCriterion = new searchTypes[newType].handlerClass;
    this.criterions.splice(index, 1);
    this.criterions.splice(index,0, newSearchCriterion);

    this.fields.removeAt(index);
    this.fields.insert(index, newSearchCriterion.formGroup);
  }

  get fields(): FormArray {
    return this.searchForm.get("fields") as FormArray;
  }



  get searchTypes() : searchTypesI {
    return searchTypes;
  }

  search() {
    console.log("Search clicked!");
  }

  addSearchCriterion(index: number, searchCriterion: SearchCriterion) {

    const newSearchCriterion: SearchCriterion = new searchTypes[searchCriterion.type].handlerClass;

    //const newForm = newSearchCriterion.initForm();
    this.fields.insert(index+1, searchCriterion.formGroup);
    this.criterions.splice(index+1,0, newSearchCriterion);

    //Add operator
    const newOperator = new LogicalOperator();
    this.fields.insert(index+1, newOperator.formGroup);
    this.criterions.splice(index+1,0, newOperator);

  }

  appendSearchCriterion(searchCriterion: SearchCriterion) {
    this.addSearchCriterion(this.criterions.length-1, searchCriterion);
  }


  removeSearchCriterion(index: number) {
    this.fields.removeAt(index);
    this.criterions.splice(index,1);

  }

  show_form() {
    this.result = this.searchForm.value;
  }


}
