import {Component, Input} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AaService} from "../../services/aa.service";
import {Router} from "@angular/router";
import {ConeService} from "../../services/cone.service";
import {SearchBaseCriterionComponent} from "./criterions/search-base-criterion/search-base-criterion.component";
import {AsyncPipe, JsonPipe, NgFor, NgIf} from "@angular/common";
import {TitleSearchCriterion} from "./criterions/standard/TitleSearchCriterion";
import {SearchCriterion, SearchType} from "./criterions/SearchCriterion";

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

  protected readonly SearchType = SearchType;

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) {


  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      fields: this.fb.array([])
    });


    this.addSearchCriterion(0, new TitleSearchCriterion());
    this.addSearchCriterion(0, new TitleSearchCriterion());
    //Create main search form with form array


    //Add criterions to array
    /*
    for(let searchCriterion of this.criterions) {
      const formArray = this.searchForm.get("fields") as FormArray;
      formArray.push(searchCriterion.form);
    }

     */

  }

  get fields(): FormArray {
    return this.searchForm.get("fields") as FormArray;
  }

  search() {
    console.log("Search clicked!");
  }

  addSearchCriterion(index: number, searchCriterion: SearchCriterion) {

    const newSearchCriterion = searchCriterion.getNewInstance();

    const newForm: FormGroup = newSearchCriterion.initForm();
    this.fields.insert(index+1, newForm);
    this.criterions.splice(index+1,0, newSearchCriterion);

  }
  removeSearchCriterion(index: number) {
    this.fields.removeAt(index);
    this.criterions.splice(index,1);

  }

  show_form() {
    this.result = this.searchForm.value;
  }

}
