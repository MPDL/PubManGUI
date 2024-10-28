import { AsyncPipe, CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  QueryList,
  TemplateRef,
  ViewChildren,
  HostListener,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationDirective } from 'src/app/shared/directives/pagination.directive';
import { ItemListElementComponent } from './item-list-element/item-list-element.component';
import {ActivatedRoute, NavigationEnd, Params, Router, RouterLink} from '@angular/router';
import { TopnavComponent } from 'src/app/shared/components/topnav/topnav.component';
import { Observable, filter, map, startWith, tap, of} from 'rxjs';
import { ItemVersionVO } from 'src/app/model/inge';

import { AaService } from 'src/app/services/aa.service';
import { ItemsService}  from "../../services/pubman-rest-client/items.service";


@Component({
  selector: 'pure-item-list',
  standalone: true,
  imports: [
    CommonModule,
    PaginationDirective,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgFor,
    NgIf,
    ItemListElementComponent,
    AsyncPipe,
    RouterLink,
    TopnavComponent
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent implements AfterViewInit{

  @Input() searchQuery: Observable<any> = of({});
  //@Input() filterSectionTemplate?: TemplateRef<any> | undefined;
  @ViewChildren(ItemListElementComponent) list_items!: QueryList<ItemListElementComponent>;
  @ViewChild("sortAndFilter", { read: ViewContainerRef }) vcr!: ViewContainerRef;

  result_list: Observable<ItemVersionVO[]> | undefined;
  number_of_results: number | undefined;
  filterEvents: Map<string, FilterEvent> = new Map();

  select_all = new FormControl(false);
  select_pages_2_display = new FormControl(25);

  pages_2_display = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 250, label: '250' },
  ];

  // Pagination:
  page_size = 25;
  number_of_pages = 1;
  current_page = 1;
  jump_to = new FormControl<number>(this.current_page, [Validators.nullValidator, Validators.min(1)]);

  selectAll = $localize`:@@selectAll:select all`;
  deselectAll = $localize`:@@deselectAll:deselect all`;

  currentSortQuery: any;
  currentQuery: any;
  isScrolled = false;

  constructor(
    private service: ItemsService,
    public aa: AaService,
    private router: Router,
    private route: ActivatedRoute
  )
  {
   this.readQueryParams()
  }

  ngAfterViewInit(): void {

    this.searchQuery.subscribe(q => {
      if (q) {
        this.currentQuery = q;
        this.update_query(this.currentQuery, this.page_size, this.getFromValue(), this.currentSortQuery);
      } else {
        this.currentQuery = { bool: { filter: [] } };
        this.update_query(this.currentQuery, this.page_size, this.getFromValue(), this.currentSortQuery);

      }
    })

  }

  private updateQueryParams() {
    const queryParams: Params = {
      p: this.current_page,
      s: this.page_size
    };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  private readQueryParams() {
    const page = this.route.snapshot.queryParamMap.get('p');
    if(page) {
      this.current_page = Number(page);
      this.jump_to.setValue(this.current_page)
    }
    const size = this.route.snapshot.queryParamMap.get('s');
    if(size) {
      this.page_size = Number(size)
    }
  }

  update_query(query: any, size:number, from:number, sortQuery?: any ) {

    console.log("Query " + JSON.stringify(query));
    console.log("sort Query " + sortQuery);
    if(this.filterEvents.size > 0) {

      const filterQueries = Array.from(this.filterEvents.values()).filter(fe => fe.query).map(fe => fe.query);
      query = {
        bool: {
          must: [
            query,
            ...filterQueries
          ]
        }
      }
    }

    const completeQuery = {
      query,
      size: size,
      from: from,
      ...sortQuery && {sort: [sortQuery
      ]}
    }
    console.log(completeQuery)
    this.items(completeQuery);

    this.updateQueryParams();
  }

  items(body: any) {
    let token = undefined;
    if (this.aa.token) token = this.aa.token;
    this.result_list = this.service.elasticSearch(body, token).pipe(
      tap(result => {
        this.number_of_results = result.hits.total.value as number;
        this.number_of_pages = Math.ceil(this.number_of_results / this.page_size)
        this.jump_to.addValidators(Validators.max(this.number_of_pages));
      }),
      map(result => result.hits.hits.map((record:any) => record._source as ItemVersionVO))
    );
  }

  jumpToPage() {
    console.log("jump_to", this.jump_to.value);
    this.jump_to.errors? alert("value must be between 1 and " + this.number_of_pages) : this.onPageChange(this.jump_to.value as number);
  }

  show(item: ItemVersionVO) {
    this.router.navigate(['edit', item.objectId])
  }

  select_pages(total: number): Array<number> {
    const elems = 7;
    if (total < elems) {
      return [...Array(total).keys()];
    }
    const left = Math.max(0, Math.min(total - elems, this.current_page - Math.floor(elems / 2)));
    const items = Array(elems);
    for (let i = 0; i < elems; i += 1) {
      items[i] = i + left;
    }
    if (items[0] > 0) {
      items[0] = 0;
      items[1] = '...';
    }
    if (items[items.length - 1] < total - 1) {
      items[items.length - 1] = total - 1;
      items[items.length - 2] = '...';
    }

    return items;
  }

  isNumber(val: any): boolean { return typeof val === 'number'; }

  getFromValue(){
    return this.current_page * this.page_size - this.page_size;
  }

  onPageChange(page_number: number) {
    console.log("page_number: ", page_number);
    this.current_page = page_number;
    this.jump_to.setValue(page_number);
    const from = this.getFromValue();
    this.update_query(this.currentQuery, this.page_size, from, this.currentSortQuery)
  }

  pageSizeHandler(event: any) {
    const relocate = this.current_page * this.page_size;
    this.page_size = Number.parseInt(event.target.value);
    this.number_of_pages = this.number_of_results ? Math.ceil(this.number_of_results / this.page_size) : 0;
    if (relocate < this.page_size || relocate > this.number_of_pages) {
      this.current_page = 1;
    } else {
      this.current_page = Math.floor(relocate / this.page_size);
    }
    this.onPageChange(this.current_page);
  }

  select_all_items(event: any) {
    if (event.target.checked) {
      this.list_items.map(li => li.check_box.setValue(true));
    } else {
      this.list_items.map(li => li.check_box.setValue(false));
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

  registerFilter(fe: FilterEvent) {
    //const filterEvent : FilterEvent = fe as FilterEvent;
    console.log("registerFilter: " + fe)
    this.filterEvents.set(fe.name,fe);
    //this.update_query(this.currentQuery, this.page_size, 0);

  }

  updateFilter(fe: FilterEvent) {

   console.log("updateFilter: " + fe)
    this.filterEvents.set(fe.name,fe);
    this.onPageChange(1)



  }

  registerSort(sortQuery: any) {
    //const filterEvent : FilterEvent = fe as FilterEvent;
    console.log("registerSort: " + sortQuery)
    this.currentSortQuery = sortQuery;
    //this.update_query(this.currentQuery, this.page_size, 0);

  }

  updateSort(sortQuery: any) {
    this.currentSortQuery = sortQuery
    this.onPageChange(1)

  }


}

export interface FilterEvent {
  name: string,
  query: object | undefined;
}
