import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe, JsonPipe, KeyValuePipe, NgFor, NgIf, NgTemplateOutlet} from "@angular/common";
import {SearchCriterion} from "./criterions/SearchCriterion";
import {LogicalOperator} from "./criterions/operators/LogicalOperator";
import {DisplayType, searchTypes, searchTypesI} from "./criterions/search_config";
import {Parenthesis, PARENTHESIS_TYPE} from "./criterions/operators/Parenthesis";
import {CreatorRole, IdType, SavedSearchVO} from "../../model/inge";
import {TitleSearchCriterion} from "./criterions/StandardSearchCriterion";
import {OrganizationSearchCriterion, PersonSearchCriterion} from "./criterions/StringOrHiddenIdSearchCriterion";
import {DATE_SEARCH_TYPES, DateSearchCriterion} from "./criterions/DateSearchCriterion";
import {forkJoin, map, Subscription, tap} from "rxjs";
import {OptionDirective} from "../../shared/components/selector/directives/option.directive";
import {PureOusDirective} from "../../shared/components/selector/services/pure_ous/pure-ous.directive";
import {SelectorComponent} from "../../shared/components/selector/selector.component";
import {OuAutosuggestComponent} from "../../shared/components/ou-autosuggest/ou-autosuggest.component";
import {PersonAutosuggestComponent} from "../../shared/components/person-autosuggest/person-autosuggest.component";
import {GenreListSearchCriterion} from "./criterions/GenreListSearchCriterion";
import {PublicationStateSearchCriterion} from "./criterions/PublicationStateSearchCriterion";
import {COMPONENT_SEARCH_TYPES, FileSectionSearchCriterion} from "./criterions/FileSectionSearchCriterion";
import {FileSectionComponent} from "./file-section-component/file-section-component.component";
import {AaService} from "../../services/aa.service";
import {Clipboard} from "@angular/cdk/clipboard";
import {ItemStateListSearchCriterion} from "./criterions/ItemStateListSearchCriterion";
import {SavedSearchService} from "../../services/pubman-rest-client/saved-search.service";
import {Component, HostListener, ViewEncapsulation} from "@angular/core";
import {ContextListSearchCriterion} from "./criterions/ContextListSearchCriterion";
import {SearchStateService} from "../search-result-list/search-state.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {SortByLabelPipe} from "../../shared/services/pipes/sort-by-label.pipe";
import {ItemActionsModalComponent} from "../../shared/components/item-actions-modal/item-actions-modal.component";
import {SavedSearchesModalComponent} from "../../shared/components/saved-searches-modal/saved-searches-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-item-search-advanced',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, NgFor, NgIf, JsonPipe, OptionDirective, PureOusDirective, SelectorComponent, OuAutosuggestComponent, PersonAutosuggestComponent, FileSectionComponent, DatePipe, KeyValuePipe, TranslatePipe, SortByLabelPipe, NgTemplateOutlet
  ],
  templateUrl: './item-search-advanced.component.html',
  styleUrl: './item-search-advanced.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ItemSearchAdvancedComponent {

  searchForm!: FormGroup;

  result: any;
  query: any;

  identifierOptions = Object.keys(IdType);
  personOptions = Object.keys(CreatorRole);
  currentlyOpenedParenthesis!: Parenthesis | undefined;
  possibleCriterionsForClosingParenthesisMap: SearchCriterion[] = []
  protected readonly DisplayType = DisplayType;

  contextListSearchCriterion = new ContextListSearchCriterion();
  itemStateListSearchCriterion = new ItemStateListSearchCriterion();
  genreListSearchCriterion = new GenreListSearchCriterion(this.translateService);
  publicationStateSearchCriterion = new PublicationStateSearchCriterion();
  fileSectionSearchCriterion = new FileSectionSearchCriterion(COMPONENT_SEARCH_TYPES.FILES);
  locatorSectionSearchCriterion = new FileSectionSearchCriterion(COMPONENT_SEARCH_TYPES.LOCATORS);

  private principalSubscription?: Subscription;

  anzGenreCols: number = 0;
  anzGenreRows: number = 0;
  genreRows: number[] = [];
  genreCols: number[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    protected aaService: AaService,
    private savedSearchService: SavedSearchService,
    private clipboard: Clipboard,
    private searchStateService: SearchStateService,
    private translateService: TranslateService,
    private modalService: NgbModal
) {
    this.initializeGenres();
  }

  ngOnInit() {
    this.reset();
    const searchId = this.route.snapshot.queryParamMap.get("searchId");
    if (searchId) {
      this.savedSearchService.retrieve(searchId).subscribe(savedSearch => {
        this.parseFormJson(savedSearch.searchForm);
      })
    }

  }

  ngOnDestroy() {
    console.log("Destroying advanced search");
    this.principalSubscription?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
//    console.log('Fenstergröße geändert', event.target.innerWidth);
    this.initializeGenres();
  }

  initializeGenres() {
    this.anzGenreCols = 3;
    if (window.innerWidth < 768) {
      this.anzGenreCols = 1;
    } else if (window.innerWidth < 1400) {
      this.anzGenreCols = 2;
    }

    this.anzGenreRows = Math.ceil((this.genreListSearchCriterion.genreOptions.length - 1) / this.anzGenreCols); // ohne Thesis
    this.genreRows = Array(this.anzGenreRows).fill(null).map((x, i) => i);
    this.genreCols = Array(this.anzGenreCols).fill(null).map((x, i) => i);
  }

  reset() {
    this.itemStateListSearchCriterion = new ItemStateListSearchCriterion();
    this.genreListSearchCriterion = new GenreListSearchCriterion(this.translateService);
    this.publicationStateSearchCriterion = new PublicationStateSearchCriterion();
    this.fileSectionSearchCriterion = new FileSectionSearchCriterion(COMPONENT_SEARCH_TYPES.FILES);
    this.locatorSectionSearchCriterion = new FileSectionSearchCriterion(COMPONENT_SEARCH_TYPES.LOCATORS);
    this.contextListSearchCriterion = new ContextListSearchCriterion();

    this.searchForm = this.fb.group({

      flexibleFields: this.fb.array([]),
      contexts: this.contextListSearchCriterion,
      itemStates: this.itemStateListSearchCriterion,
      genres: this.genreListSearchCriterion,
      publicationState: this.publicationStateSearchCriterion,
      files: this.fileSectionSearchCriterion,
      locators: this.locatorSectionSearchCriterion
    });

    this.flexibleFields.push(new TitleSearchCriterion());
    this.flexibleFields.push(new LogicalOperator("and"));
    this.flexibleFields.push(new PersonSearchCriterion());
    this.flexibleFields.push(new LogicalOperator("and"));
    this.flexibleFields.push(new OrganizationSearchCriterion());
    this.flexibleFields.push(new LogicalOperator("and"));
    this.flexibleFields.push(new DateSearchCriterion(DATE_SEARCH_TYPES.ANYDATE));
  }

  parseFormJson(formJson: any) {
    //Reset all
    this.reset();

    for (let [key, value] of Object.entries(formJson)) {

      if (key === "flexibleFields") {
        //Clear old fields
        this.flexibleFields.clear();
        //Recreate flexible search criterions and patch form values
        for (let currentField of (value as any[])) {
          const newSearchCriterion: SearchCriterion = new searchTypes[currentField.type].handlerClass(currentField.type);
          newSearchCriterion.patchValue(currentField);
          this.flexibleFields.push(newSearchCriterion);
        }
      } else {
        //Just patch the values for genre list, file section etc.
        this.searchForm.patchValue({[key]: value});
      }
    }
  }


  changeType(index: number, newType: string) {
    //console.log("Change criterion at index " + index + " to type " + newType);

    const newSearchCriterion: SearchCriterion = new searchTypes[newType].handlerClass(newType);
    this.flexibleFields.removeAt(index);
    this.flexibleFields.insert(index, newSearchCriterion);
  }

  changeOperator(index: number, newOperatorType: string) {
    //console.log("Change operator at index " + index + " to type " + newOperatorType);
    const newSearchCriterion = new LogicalOperator(newOperatorType);
    this.flexibleFields.removeAt(index);
    this.flexibleFields.insert(index, newSearchCriterion);
  }

  get flexibleFields(): FormArray {
    return this.searchForm.get("flexibleFields") as FormArray;
  }


  get searchTypes(): searchTypesI {
    return searchTypes;
  }

  get genreListKeys(): string[] {
    return Object.keys((this.genreListSearchCriterion.get('content')?.get('genres') as FormGroup).controls);
    //return this.genreListFormGroup as FormGroup;
  }



  addSearchCriterion(index: number, searchCriterion: SearchCriterion) {

    let newSearchCriterion: SearchCriterion;
    if (DisplayType.PARENTHESIS === this.searchTypes[searchCriterion.type].displayType) {
      newSearchCriterion = new TitleSearchCriterion();
    } else {
      newSearchCriterion = new searchTypes[searchCriterion.type].handlerClass(searchCriterion.type);
    }

    newSearchCriterion.level = searchCriterion.level;
    this.flexibleFields.insert(index + 1, newSearchCriterion);

    // If the add button of an opening parenthesis is used, the logical operator has to be added
    // after the new criterion
    if (PARENTHESIS_TYPE.OPENING_PARENTHESIS === searchCriterion.type) {
      this.flexibleFields.insert(index + 2, new LogicalOperator("and"));
    } else {
      this.flexibleFields.insert(index + 1, new LogicalOperator("and"));
    }

    this.updateListForClosingParenthesis(this.currentlyOpenedParenthesis);

  }


  removeSearchCriterion(index: number) {

    const sc = this.flexibleFields.at(index) as SearchCriterion;
    this.removeSearchCriterionWithOperator(this.flexibleFields.controls as SearchCriterion[], sc);
    this.updateListForClosingParenthesis(this.currentlyOpenedParenthesis);

  }

  addOpeningParenthesis(index: number) {
    this.currentlyOpenedParenthesis = new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS);
    this.currentlyOpenedParenthesis.level = (this.flexibleFields.at(index) as SearchCriterion).level;
    // add before criterion
    this.flexibleFields.insert(index, this.currentlyOpenedParenthesis);

    this.updateListForClosingParenthesis(this.currentlyOpenedParenthesis);
    //console.log(this.possibleCriterionsForClosingParenthesisMap);
  }

  addClosingParenthesis(index: number) {
    const closingParenthesis = new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS);
    this.currentlyOpenedParenthesis!.partnerParenthesis = closingParenthesis;
    closingParenthesis.partnerParenthesis = this.currentlyOpenedParenthesis;
    this.currentlyOpenedParenthesis = undefined;
    this.flexibleFields.insert(index + 1, closingParenthesis);
    this.updateListForClosingParenthesis(undefined);
  }

  removeParenthesis(position: number) {
    const parenthesis = this.flexibleFields.at(position) as Parenthesis;
    const partnerParenthesis = parenthesis.partnerParenthesis;

    this.flexibleFields.controls.splice(position, 1);
    if (partnerParenthesis) {
      this.flexibleFields.controls.splice(this.flexibleFields.controls.indexOf(partnerParenthesis), 1);
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

    for (let sc of this.flexibleFields.controls as SearchCriterion[]) {

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
        if (searchTypes[sci.type] && DisplayType.OPERATOR === (searchTypes[sci.type].displayType)) {
          criterionList.splice(position, 1);
          criterionList.splice(i, 1);
          break;

        }
      }
    } else {
      // delete logical operator after
      for (let i = position; i < criterionList.length; i++) {
        const sci = criterionList[i];
        if (searchTypes[sci.type] && DisplayType.OPERATOR === (searchTypes[sci.type].displayType)) {
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
    if (criterionList != null && criterionList.length > 0 &&
      searchTypes[criterionList[0].type] && DisplayType.OPERATOR == (searchTypes[criterionList[0].type].displayType)) {
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
    return forkJoin(cleanedScList.map(sc => {
      const query = sc.toElasticSearchQuery();
      //console.log("Calling " + sc.type + query);
      return query;
    }))

      //Set query in every search criterion object
      .pipe(
        tap(queries => cleanedScList.forEach((sc, i) => {
          //console.log("Transforming list to queries " + sc.type + " -- " + JSON.stringify(queries[i]));
          sc.query = queries[i];
        })),
        //when everything is ready, create complete query
        map(data => {
            return this.cleanedScListToElasticSearchQuery(cleanedScList, data, undefined)
          }
        )
      )

  }

  private cleanedScListToElasticSearchQuery(scList: SearchCriterion[], queries: (Object | undefined)[], parentNestedPath: string | undefined): Object | undefined {

    //SearchCriterionBase.logger.debug("Call with list: " + scList);

    //console.log("Transforming list to queries " + queries)
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

      if (searchTypes[sc.type] && DisplayType.OPERATOR === (searchTypes[sc.type].displayType)) {

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


  prepareQuery() {
    const searchCriterions = this.flexibleFields.controls.map(fc => fc as SearchCriterion);
    searchCriterions.unshift(new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS));
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS));

    searchCriterions.push(new LogicalOperator("and"));
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS));
    searchCriterions.push(this.contextListSearchCriterion);
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS));

    searchCriterions.push(new LogicalOperator("and"));
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS));
    searchCriterions.push(this.itemStateListSearchCriterion);
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS));

    searchCriterions.push(new LogicalOperator("and"));
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS));
    searchCriterions.push(this.genreListSearchCriterion);
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS));

    searchCriterions.push(new LogicalOperator("and"));
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS));
    searchCriterions.push(this.publicationStateSearchCriterion);
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS));

    searchCriterions.push(new LogicalOperator("and"));
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS));
    searchCriterions.push(this.fileSectionSearchCriterion);
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS));

    searchCriterions.push(new LogicalOperator("and"));
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.OPENING_PARENTHESIS));
    searchCriterions.push(this.locatorSectionSearchCriterion);
    searchCriterions.push(new Parenthesis(PARENTHESIS_TYPE.CLOSING_PARENTHESIS));


    return searchCriterions
  }

  search() {

    this.scListToElasticSearchQuery(this.prepareQuery())
      .subscribe(query => {
        this.searchStateService.$currentQuery.next(query);
        this.router.navigateByUrl('/search')
      });

  }

  show_form() {
    this.result = this.searchForm.value;
  }

  show_query() {
    this.scListToElasticSearchQuery(this.prepareQuery()).subscribe(query => this.query = query);
  }


  openSavedSearchModal() {
    const comp: SavedSearchesModalComponent = this.modalService.open(SavedSearchesModalComponent, {scrollable: true, size: "lg"}).componentInstance;
    comp.searchFormJson = this.searchForm.value;

    comp.applySearchForm.subscribe(data => {
      this.parseFormJson(data);
    })

  }
}


