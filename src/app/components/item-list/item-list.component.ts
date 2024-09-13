import { AsyncPipe, CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, Input, QueryList, ViewChildren, HostListener } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationDirective } from 'src/app/shared/directives/pagination.directive';
import { ItemListElementComponent } from './item-list-element/item-list-element.component';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
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
export class ItemListComponent implements AfterViewInit {

  @Input() searchQuery: Observable<any> = of({});
  @ViewChildren(ItemListElementComponent) list_items!: QueryList<ItemListElementComponent>;

  result_list: Observable<ItemVersionVO[]> | undefined;
  number_of_results: number | undefined;

  select_all = new FormControl(false);
  select_pages_2_display = new FormControl(10);

  pages_2_display = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 250, label: '250' },
  ];

  // Pagination:
  page_size = 10;
  number_of_pages = 1;
  current_page = 1;
  jump_to = new FormControl<number>(this.current_page, [Validators.nullValidator, Validators.min(1)]);

  selectAll = $localize`:@@selectAll:select all`;
  deselectAll = $localize`:@@deselectAll:deselect all`;

  update_query = (query: any) => {
    return {
      query,
      size: this.page_size,
      from: 0,
      sort: [
        {modificationDate: "desc"}
      ]
    }
  }

  current_query: any;
  isScrolled = false;

  constructor(
    private service: ItemsService,
    public aa: AaService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {

    this.searchQuery.subscribe(q => {
      console.log("Searching with query: " + q);
      if (q) {
        this.current_query = this.update_query(q);
        this.items(this.current_query);
      } else {
        this.current_query = this.update_query({ bool: { filter: [] } });
        this.items(this.current_query);
      }
    })

    /*
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // required to work immediately.
      startWith(this.router)
    ).subscribe(() => {
      //const query = history.state.query;
      console.log(this.searchQuery)
      if (this.searchQuery) {
        this.current_query = this.update_query(this.searchQuery);
        this.items(this.current_query);
      } else {
        this.current_query = this.update_query({ bool: { filter: [] } });
        this.items(this.current_query);
      }
    });

     */
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

  onPageChange(page_number: number) {
    console.log("page_number: ", page_number);
    this.current_page = page_number;
    this.jump_to.setValue(page_number);
    const from = page_number * this.page_size - this.page_size;
    this.current_query.size = this.page_size;
    this.current_query.from = from;
    this.items(this.current_query);
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
}
