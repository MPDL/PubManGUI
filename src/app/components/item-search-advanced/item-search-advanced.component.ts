import {Component, Input} from '@angular/core';
import {
  AbstractControl,
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";
import {AaService} from "../../services/aa.service";
import {Router} from "@angular/router";
import {ConeService} from "../../services/cone.service";

import {AsyncPipe, JsonPipe, NgFor, NgIf} from "@angular/common";

import {SearchCriterion} from "./criterions/SearchCriterion";
import {LogicalOperator} from "./criterions/operators/LogicalOperator";
import {DisplayType, searchTypes, searchTypesI} from "./criterions/search_config";
import {Parenthesis, PARENTHESIS_TYPE} from "./criterions/operators/Parenthesis";
import {CreatorRole, IdType, MdsPublicationGenre} from "../../model/inge";
import {KeywordSearchCriterion, TitleSearchCriterion} from "./criterions/StandardSearchCriterion";
import {OrganizationSearchCriterion, PersonSearchCriterion} from "./criterions/StringOrHiddenIdSearchCriterion";
import {DATE_SEARCH_TYPES, DateSearchCriterion} from "./criterions/DateSearchCriterion";
import {OrganizationsService} from "../../services/organizations.service";
import {debounceTime, distinctUntilChanged, forkJoin, map, Observable, OperatorFunction, switchMap, tap} from "rxjs";
import {OptionDirective} from "../../shared/components/selector/directives/option.directive";
import {PureOusDirective} from "../../shared/components/selector/services/pure_ous/pure-ous.directive";
import {SelectorComponent} from "../../shared/components/selector/selector.component";
import {NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {OuAutosuggestComponent} from "../../shared/components/ou-autosuggest/ou-autosuggest.component";
import {PersonAutosuggestComponent} from "../../shared/components/person-autosuggest/person-autosuggest.component";


@Component({
  selector: 'pure-item-search-advanced',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, NgFor, NgIf, JsonPipe, OptionDirective, PureOusDirective, SelectorComponent, OuAutosuggestComponent, PersonAutosuggestComponent
  ],
  templateUrl: './item-search-advanced.component.html',
  styleUrl: './item-search-advanced.component.scss'
})
export class ItemSearchAdvancedComponent {

  searchForm!: FormGroup;

  result: any;
  query: any;

  identifierOptions = Object.keys(IdType);
  personOptions = Object.keys(CreatorRole);
  genreOptions = Object.keys(MdsPublicationGenre);
  currentlyOpenedParenthesis!: Parenthesis | undefined;
  possibleCriterionsForClosingParenthesisMap: SearchCriterion[] = []
  protected readonly DisplayType = DisplayType;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      fields: this.fb.array([])
    });

    this.fields.push(new TitleSearchCriterion());
    this.fields.push(new LogicalOperator("and"));
    this.fields.push(new PersonSearchCriterion());
    this.fields.push(new LogicalOperator("and"));
    this.fields.push(new OrganizationSearchCriterion());
    this.fields.push(new LogicalOperator("and"));
    this.fields.push(new DateSearchCriterion(DATE_SEARCH_TYPES.ANYDATE));


  }

  changeType(index: number, newType: string) {
    console.log("Change criterion at index " + index + " to type " + newType);

    const newSearchCriterion: SearchCriterion = new searchTypes[newType].handlerClass(newType);
    this.fields.removeAt(index);
    this.fields.insert(index, newSearchCriterion);
  }

  changeOperator(index: number, newOperatorType: string) {
    //console.log("Change operator at index " + index + " to type " + newOperatorType);
    const newSearchCriterion = new LogicalOperator(newOperatorType);
    this.fields.removeAt(index);
    this.fields.insert(index, newSearchCriterion);
  }

  get fields(): FormArray {
    return this.searchForm.get("fields") as FormArray;
  }


  get searchTypes(): searchTypesI {
    return searchTypes;
  }


  addSearchCriterion(index: number, searchCriterion: SearchCriterion) {

    let newSearchCriterion: SearchCriterion;
    if (DisplayType.PARENTHESIS === this.searchTypes[searchCriterion.type].displayType) {
      newSearchCriterion = new TitleSearchCriterion();
    } else {
      newSearchCriterion = new searchTypes[searchCriterion.type].handlerClass(searchCriterion.type);
    }

    newSearchCriterion.level = searchCriterion.level;
    this.fields.insert(index + 1, newSearchCriterion);

    // If the add button of an opening parenthesis is used, the logical operator has to be added
    // after the new criterion
    if (PARENTHESIS_TYPE.OPENING_PARENTHESIS === searchCriterion.type) {
      this.fields.insert(index + 2, new LogicalOperator("and"));
    } else {
      this.fields.insert(index + 1, new LogicalOperator("and"));
    }

    this.updateListForClosingParenthesis(this.currentlyOpenedParenthesis);

  }


  removeSearchCriterion(index: number) {

    const sc = this.fields.at(index) as SearchCriterion;
    this.removeSearchCriterionWithOperator(this.fields.controls as SearchCriterion[], sc);
    this.updateListForClosingParenthesis(this.currentlyOpenedParenthesis);

  }

  addOpeningParenthesis(index: number) {
    this.currentlyOpenedParenthesis = new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS);
    this.currentlyOpenedParenthesis.level = (this.fields.at(index) as SearchCriterion).level;
    // add before criterion
    this.fields.insert(index, this.currentlyOpenedParenthesis);

    this.updateListForClosingParenthesis(this.currentlyOpenedParenthesis);
    //console.log(this.possibleCriterionsForClosingParenthesisMap);
  }

  addClosingParenthesis(index: number) {
    const closingParenthesis = new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS);
    this.currentlyOpenedParenthesis!.partnerParenthesis = closingParenthesis;
    closingParenthesis.partnerParenthesis = this.currentlyOpenedParenthesis;
    this.currentlyOpenedParenthesis = undefined;
    this.fields.insert(index + 1, closingParenthesis);
    this.updateListForClosingParenthesis(undefined);
  }

  removeParenthesis(position: number) {
    const parenthesis = this.fields.at(position) as Parenthesis;
    const partnerParenthesis = parenthesis.partnerParenthesis;

    this.fields.controls.splice(position, 1);
    if (partnerParenthesis) {
      this.fields.controls.splice(this.fields.controls.indexOf(partnerParenthesis), 1);
    }

    if (parenthesis === (this.currentlyOpenedParenthesis)) {
      this.currentlyOpenedParenthesis = undefined;
    }

    this.updateListForClosingParenthesis(this.currentlyOpenedParenthesis);
  }

  private updateListForClosingParenthesis(startParenthesis: Parenthesis | undefined) {
    this.possibleCriterionsForClosingParenthesisMap = [];
    let balanceCounter = 0;
    let lookForClosingParenthesis = false;
    let startParenthesisBalance = 0;

    let numberOfSearchCriterions = 0;

    for (let sc of this.fields.controls as SearchCriterion[]) {

      if (PARENTHESIS_TYPE.CLOSING_PARENTHESIS === sc.type) {
        balanceCounter--;
        if (lookForClosingParenthesis && balanceCounter <= startParenthesisBalance) {
          lookForClosingParenthesis = false;
        }
      }

      sc.level = balanceCounter;

      if (PARENTHESIS_TYPE.OPENING_PARENTHESIS === sc.type) {
        balanceCounter++;
      }

      if (sc === startParenthesis) {
        lookForClosingParenthesis = true;
        startParenthesisBalance = sc.level;
      }

      if (lookForClosingParenthesis && DisplayType.OPERATOR !== searchTypes[sc.type].displayType
        && balanceCounter === startParenthesisBalance + 1 && sc !== startParenthesis) {
        this.possibleCriterionsForClosingParenthesisMap.push(sc);
      }


      if (DisplayType.OPERATOR !== searchTypes[sc.type].displayType
        && DisplayType.PARENTHESIS !== searchTypes[sc.type].displayType) {
        numberOfSearchCriterions++;
      }
    }

  }


  private removeSearchCriterionWithOperator(criterionList: SearchCriterion[], criterion: SearchCriterion) {

    const position = criterionList.indexOf(criterion);
    // try to delete
    let deleteBefore = true;
    if (position == 0) {
      deleteBefore = false;
    } else if (position - 1 >= 0) {
      let scBefore = criterionList[position - 1];


      deleteBefore = scBefore.type !== (PARENTHESIS_TYPE.OPENING_PARENTHESIS);

      if (!deleteBefore && position + 1 < criterionList.length) {
        let scAfter = criterionList[position + 1];
        deleteBefore = scAfter.type === (PARENTHESIS_TYPE.CLOSING_PARENTHESIS);
      }
    }


    if (deleteBefore) {
      for (let i = position; i >= 0; i--) {
        const sci = criterionList[i];
        if (DisplayType.OPERATOR === (searchTypes[sci.type].displayType)) {
          criterionList.splice(position, 1);
          criterionList.splice(i, 1);
          break;

        }
      }
    } else {
      // delete logical operator after
      for (let i = position; i < criterionList.length; i++) {
        const sci = criterionList[i];
        if (DisplayType.OPERATOR === (searchTypes[sci.type].displayType)) {
          criterionList.splice(i, 1);
          criterionList.splice(position, 1);
          break;

        }
      }
    }

    // if none was found, just remove the criteria itself
    if (criterionList.includes(criterion))
      criterionList.splice(criterionList.indexOf(criterion), 1);


    let parenthesisToRemove: SearchCriterion[] = [];
    // now remove empty parenthesis
    for (let i = 0; i < criterionList.length; i++) {
      let sc = criterionList[i];
      if (PARENTHESIS_TYPE.OPENING_PARENTHESIS === (sc.type)) {
        if (i + 1 < criterionList.length) {
          let next = criterionList[i + 1];
          if (PARENTHESIS_TYPE.CLOSING_PARENTHESIS === (next.type)) {
            parenthesisToRemove.push(sc);
            parenthesisToRemove.push(next);
          }
        }

      }
    }

    parenthesisToRemove.forEach(parenthesis => {
      if (criterionList.includes(parenthesis)) criterionList.splice(criterionList.indexOf(parenthesis), 1);
    });

    // if first criterion is an operand, remove it
    if (criterionList != null && criterionList.length > 0
      && DisplayType.OPERATOR == (searchTypes[criterionList[0].type].displayType)) {
      criterionList.splice(0, 1);
    }


  }


  private removeEmptyFields(criterionList: SearchCriterion[]): SearchCriterion[] {
    if (!criterionList) {
      return [];


    } else {


      let copyForRemoval = [...criterionList];
      let copyForIteration = [...criterionList];
      // Collections.copy(copy, criterionList);

      for (let sc of copyForIteration) {
        if (sc.isEmpty()) {
          this.removeSearchCriterionWithOperator(copyForRemoval, sc);
          //console.log("Removing " + sc.type);
        }
      }

      // if first in list is an operator except "NOT", remove it
      if (copyForRemoval.length > 0 && (copyForRemoval[0].type === "and" || copyForRemoval[0].type === "or")) {
        copyForRemoval.splice(0, 1);
      }
      return copyForRemoval;
    }
  }


  private scListToElasticSearchQuery(scList: SearchCriterion[]) {
    const cleanedScList = this.removeEmptyFields(scList);

    //console.log("Cleaned List " + cleanedScList);

    // Set partner parenthesis for every parenthesis
    let parenthesisStack: Parenthesis[] = [];
    for (let sc of cleanedScList) {
      if (PARENTHESIS_TYPE.OPENING_PARENTHESIS === (sc.type)) {
        parenthesisStack.push(sc as Parenthesis);

      } else if (PARENTHESIS_TYPE.CLOSING_PARENTHESIS === (sc.type)) {

        const closingParenthesis = sc as Parenthesis;
        const openingParenthesis = parenthesisStack.pop();

        closingParenthesis.partnerParenthesis = openingParenthesis;
        openingParenthesis!.partnerParenthesis = closingParenthesis;
      }
    }
    //Join all subquery-creations
    return forkJoin(cleanedScList.map(sc => sc.toElasticSearchQuery()))
      //Set query in every search criterion object
      .pipe(tap(queries => cleanedScList.forEach((sc, i) => {
        sc.query = queries[i]
      })))

      //when everything is ready, create complete query
      .pipe(map(data => {
            return this.cleanedScListToElasticSearchQuery(cleanedScList, data, undefined)
          }
        )
      )

  }

  private cleanedScListToElasticSearchQuery(scList: SearchCriterion[], queries: (Object | undefined)[], parentNestedPath: string | undefined): Object | undefined {

    //SearchCriterionBase.logger.debug("Call with list: " + scList);

    if (scList.length == 0) {
      return {match_all: {}};
    }

    let resultedQueryBuilder: Object | undefined = {};

    let parenthesisOpened = 0;

    let mainOperators: LogicalOperator[] = [];
    let lastOperator: LogicalOperator | undefined;
    let mixedOrAndAnd: boolean = false;
    let sharedNestedField: string | undefined = "";
    let criterionList = [...scList];

    //SearchCriterionBase.logger.debug("List: " + criterionList);

    // Remove unnecessary parenthesis
    while (PARENTHESIS_TYPE.OPENING_PARENTHESIS === (criterionList[0].type)
    && PARENTHESIS_TYPE.CLOSING_PARENTHESIS === (criterionList[criterionList.length - 1].type)
    && (criterionList[0] as Parenthesis).partnerParenthesis === (criterionList[criterionList.length - 1] as Parenthesis)) {

      criterionList.splice(0, 1);
      criterionList.splice(criterionList.length - 1, 1);
    }

    //SearchCriterionBase.logger.debug("List after removal: " + criterionList);

    for (let sc of criterionList) {

      if (DisplayType.OPERATOR === (searchTypes[sc.type].displayType)) {

        if (parenthesisOpened == 0) {

          const op: LogicalOperator = sc as LogicalOperator;
          mainOperators.push(op);
          //Check if this operator changes from last
          if (lastOperator && ((lastOperator.type === "or" && op.type !== "or")
            || (lastOperator.type !== "or" && op.type === "or")

          )) {
            mixedOrAndAnd = true;
          }
          lastOperator = op;
        }

      } else if (PARENTHESIS_TYPE.OPENING_PARENTHESIS === sc.type) {
        parenthesisOpened++;

      } else if (PARENTHESIS_TYPE.CLOSING_PARENTHESIS === sc.type) {
        parenthesisOpened--;

      } else {

        // if all criterias have the same nested field and if it's different from the parent
        // nested
        // criteria, set a new nested query
        if ((sharedNestedField && sharedNestedField.length === 0
            && !(parentNestedPath && sc.getElasticSearchNestedPath() === parentNestedPath))
          || (!sc.getElasticSearchNestedPath() && sc.getElasticSearchNestedPath() === sharedNestedField
            && sc.getElasticSearchNestedPath() !== parentNestedPath)) {
          sharedNestedField = sc.getElasticSearchNestedPath();
        } else {
          sharedNestedField = undefined;
        }
      }
    }

    if (sharedNestedField) {
      //SearchCriterionBase.logger.debug("Found common nested field: " + sharedNestedField);
    }

    if (criterionList.length == 1) {
      resultedQueryBuilder = criterionList[0].query;

    } else if (mainOperators.length > 0) {

      //SearchCriterionBase.logger.debug("found main operators: " + mainOperators);

      //console.log("found main operators: " + mainOperators);
      let should = [];
      let must = [];
      let mustNot = [];

      // If there are AND/NOTAND operators mixed with OR operators, divide by OR operators ->
      // Remove all AND / NOTAND operators
      if (mixedOrAndAnd) {
        mainOperators = mainOperators.filter(op => op.type === "or");
        //mainOperators.removeIf(item -> !SearchCriterion.OR_OPERATOR.equals(item.getSearchCriterion()));
      }

      for (let i = 0; i < mainOperators.length; i++) {
        const op: LogicalOperator = mainOperators[i];
        const indexOfOperator = criterionList.indexOf(op);
        const nextIndexOfOperator =
          (mainOperators.length > i + 1) ? criterionList.indexOf(mainOperators[i + 1]) : criterionList.length;

        if (i == 0) {
          const leftList = criterionList.slice(0, indexOfOperator);

          if ("or" === (op.type)) {
            should.push(this.cleanedScListToElasticSearchQuery(leftList, queries, sharedNestedField));
          } else if ("and" === (op.type)) {
            must.push(this.cleanedScListToElasticSearchQuery(leftList, queries, sharedNestedField));
          } else if ("not" === (op.type)) {
            must.push(this.cleanedScListToElasticSearchQuery(leftList, queries, sharedNestedField));
            //TODO Check if "must" is correct here
          }
        }

        const rightList = criterionList.slice(indexOfOperator + 1, nextIndexOfOperator);

        if ("or" === (op.type)) {
          should.push(this.cleanedScListToElasticSearchQuery(rightList, queries, sharedNestedField));
        } else if ("and" === (op.type)) {
          must.push(this.cleanedScListToElasticSearchQuery(rightList, queries, sharedNestedField));
        } else if ("not" === (op.type)) {
          mustNot.push(this.cleanedScListToElasticSearchQuery(rightList, queries, sharedNestedField));
        }
      }

      resultedQueryBuilder =
        {
          bool: {
            ...should.length > 0 && {should: should},
            ...must.length > 0 && {must: must},
            ...mustNot.length > 0 && {mustNot: mustNot},
          }
        }
    }

    return resultedQueryBuilder;

  }

  search() {
    const searchCriterions = this.fields.controls.map(fc => fc as SearchCriterion)
    this.scListToElasticSearchQuery(searchCriterions)
      .subscribe(query =>
        this.router.navigateByUrl('/list', {onSameUrlNavigation: 'reload', state: {query}})
      );

  }

  show_form() {
    this.result = this.searchForm.value;
  }

  show_query() {
    const searchCriterions = this.fields.controls.map(fc => fc as SearchCriterion)
    this.scListToElasticSearchQuery(searchCriterions).subscribe(query => this.query = query);
  }
}
