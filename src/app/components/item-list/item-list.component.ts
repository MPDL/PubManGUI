import { AsyncPipe, CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  QueryList,
  ViewChildren,
  HostListener,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationDirective } from 'src/app/shared/directives/pagination.directive';
import { ItemListElementComponent } from './item-list-element/item-list-element.component';
import {ActivatedRoute, NavigationEnd, Params, Router, RouterLink} from '@angular/router';
import { TopnavComponent } from 'src/app/shared/components/topnav/topnav.component';
import {Observable, filter, map, startWith, tap, of, BehaviorSubject} from 'rxjs';
import { ItemVersionVO } from 'src/app/model/inge';
import { AaService } from 'src/app/services/aa.service';
import { ItemsService}  from "../../services/pubman-rest-client/items.service";
import {PaginatorChangeEvent, PaginatorComponent} from "../../shared/components/paginator/paginator.component";
import {TopnavCartComponent} from "../../shared/components/topnav/topnav-cart/topnav-cart.component";
import {TopnavBatchComponent} from "../../shared/components/topnav/topnav-batch/topnav-batch.component";


@Component({
  selector: 'pure-item-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    ItemListElementComponent,
    AsyncPipe,
    TopnavComponent,
    PaginatorComponent,
    TopnavCartComponent,
    TopnavBatchComponent
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent implements AfterViewInit{

  @Input() searchQuery: Observable<any> = of({});
  //@Input() filterSectionTemplate?: TemplateRef<any> | undefined;
  @ViewChildren(ItemListElementComponent) list_items!: QueryList<ItemListElementComponent>;
  //@ViewChild(PaginatorComponent) paginator!: PaginatorComponent

  result_list: Observable<ItemVersionVO[]> | undefined;
  number_of_results: number = 0;

  filterEvents: Map<string, FilterEvent> = new Map();
  aggregationEvents: Map<string, AggregationEvent> = new Map();

  protected currentPage!:number;
  protected size!:number
  //currentPaginatorEvent!: PaginatorChangeEvent;
  select_all = new FormControl(false);

  selectAll = $localize`:@@selectAll:select all`;
  deselectAll = $localize`:@@deselectAll:deselect all`;

  currentSortQuery: any;
  currentQuery: any;


  constructor(
    private service: ItemsService,
    public aa: AaService,
    private router: Router,
    private route: ActivatedRoute
  )
  {

  }

  ngOnInit() {
    console.log("OnInit ItemList")
    console.log(this.size)
    console.log(this.currentPage)
  }

  ngAfterViewInit(): void {

    //this.currentPaginatorEvent = this.paginator.fromToValues();

    this.searchQuery.subscribe(q => {
      if (q) {
        this.currentQuery = q;
        this.updateList();
      } /*else {
        this.currentQuery = { bool: { filter: [] } };
        this.update_query(this.currentQuery, this.page_size, this.getFromValue(), this.currentSortQuery);

      }

       */
    })

  }



  updateList() {
    let query = this.currentQuery;

    if(this.filterEvents.size > 0) {
      const filterQueries = Array.from(this.filterEvents.values()).filter(fe => fe.query).map(fe => fe.query);
      console.log("Filter Queries " + JSON.stringify(filterQueries))

      if (filterQueries.length) {
        query = {
          bool: {
            must: [
              this.currentQuery,
              ...filterQueries
            ]
          }
        }
      }
    }

    let aggQueries = undefined;
    let runtimeMappings = undefined;
    if(this.aggregationEvents.size > 0) {
      aggQueries = Object.assign({}, ...Array.from(this.aggregationEvents.values()).filter(fe => fe.query).map(fe => fe.query))
      runtimeMappings = Object.assign({}, ...Array.from(this.aggregationEvents.values()).filter(fe => fe.runtimeMapping).map(fe => fe.runtimeMapping))
    }

    const completeQuery = {
      query: query,
      size: this.size,
      from: (this.currentPage-1)*this.size,
      ...this.currentSortQuery && {sort: [this.currentSortQuery
      ]},
      ...runtimeMappings && {runtime_mappings: runtimeMappings},
      ...aggQueries && {aggs: aggQueries}
    }
    //console.log(JSON.stringify(completeQuery))
    this.search(completeQuery);
  }

  private search(body: any) {
    let token = undefined;
    if (this.aa.token) token = this.aa.token;
    this.result_list = this.service.elasticSearch(body, token).pipe(
      tap(result => {
        //console.log(JSON.stringify(result))
        this.number_of_results = result.hits.total.value as number;
        //this.number_of_pages = Math.ceil(this.number_of_results / this.page_size)
        //this.jump_to.addValidators(Validators.max(this.number_of_pages));

        if(result.aggregations) {
          this.applyAggregationResults(result.aggregations);
        }
      }),
      map(result => result.hits.hits.map((record:any) => record._source as ItemVersionVO))
    );
  }

  applyAggregationResults(aggResult: object) {
    this.aggregationEvents.forEach((ae, key) => {
      // Use ends with, because PuRe currently returns aggregation names with typed_keys parameter enabled, see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html#return-agg-type
      const aggKey = Object.keys(aggResult).find(k => k.endsWith(key)) as keyof typeof aggResult;
      if(aggResult[aggKey]){
        ae.result.next(aggResult[aggKey]);
      }
    })
  }


  selectAllItems(event: any) {
    if (event.target.checked) {
      this.list_items.map(li => li.check_box.setValue(true));
    } else {
      this.list_items.map(li => li.check_box.setValue(false));
    }
  }


  registerFilter(fe: FilterEvent) {
    //const filterEvent : FilterEvent = fe as FilterEvent;
    this.filterEvents.set(fe.name,fe);
    //this.update_query(this.currentQuery, this.page_size, 0);

  }

  updateFilter(fe: FilterEvent) {
    //console.log("Update Filter: " + fe.name + ' - ' + fe.query)
    this.filterEvents.set(fe.name,fe);
    this.currentPage=1;
    this.updateList();
    //this.onPageChange(1)
  }

  registerAggregation(ae: AggregationEvent) {
    this.aggregationEvents.set(ae.name,ae);
  }

  registerSort(sortQuery: any) {
    this.currentSortQuery = sortQuery;

  }

  updateSort(sortQuery: any) {
    this.currentSortQuery = sortQuery
    this.currentPage=1
    this.updateList();
    //this.onPageChange(1)

  }



  paginatorChanged() {
    //this.currentPaginatorEvent = $event;
    this.updateList();

  }

  checkAll() {

  }

  uncheckAll() {

  }


}

export interface FilterEvent {
  name: string,
  query: object | undefined;
}

export interface AggregationEvent {
  name: string,
  query: any | undefined;
  runtimeMapping: any | undefined;
  result: BehaviorSubject<any | undefined>;
}
