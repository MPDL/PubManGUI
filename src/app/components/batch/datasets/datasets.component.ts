import { CommonModule } from '@angular/common';
import { OnInit, Component, QueryList, ViewChildren, AfterViewInit, HostListener } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, filter, startWith, of, tap, map, timeInterval } from 'rxjs';

import { ItemVersionVO } from 'src/app/model/inge';
import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BatchNavComponent } from '../batch-nav/batch-nav.component';
import { BatchService } from '../services/batch.service';

import { PaginationDirective } from 'src/app/shared/directives/pagination.directive';
import { ItemListElementComponent } from 'src/app/components/item-list/item-list-element/item-list-element.component';
import { NavigationEnd, Router } from '@angular/router';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-batch-datasets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BatchNavComponent,
    PaginationDirective,
    ItemListElementComponent,
    NgbTooltip
  ],
  templateUrl: './datasets.component.html'
})
export default class DatasetsComponent implements OnInit {
  @ViewChildren(ItemListElementComponent) list_items!: QueryList<ItemListElementComponent>;

  results: ItemVersionVO[] = [];
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

  private isProcessing: boolean = false;
  selectAll = $localize`:@@selectAll:select all`;
  deselectAll = $localize`:@@deselectAll:deselect all`;
  isScrolled = false;

  constructor(
    public batchSvc: BatchService,
    private msgSvc: MessageService,
    public aaSvc: AaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // required to work immediately.
      startWith(this.router)
    ).subscribe(() => {
      this.items(this.batchSvc.items);
    });
  }

  items(itemList: string[]) {
    this.results = [];
    for (var element of itemList) {
      if (element) {
        this.batchSvc.getItem(element).subscribe( actionResponse => { 
          this.results.push(actionResponse);
        })
      }
    };
    this.result_list = of(this.results);
    this.number_of_results = itemList.length;
    this.number_of_pages = Math.ceil(this.number_of_results / this.page_size);
    this.jump_to.addValidators(Validators.max(this.number_of_pages));
  }

  jumpToPage() {
    this.jump_to.errors ? alert("value must be between 1 and " + this.number_of_pages) : this.onPageChange(this.jump_to.value as number);
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

  onPageChange(page_number: number):void {
    this.current_page = page_number;
    this.jump_to.setValue(page_number);
    const from = page_number * this.page_size - this.page_size;
    const to = page_number * this.page_size;
    this.result_list = of(this.results.slice(from, to));
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

  removeChecked() {
    this.batchSvc.removeFromBatchDatasets(this.batchSvc.savedSelection);
    this.items(this.batchSvc.items);
    sessionStorage.removeItem(this.batchSvc.savedSelection);
    if (!this.batchSvc.areItemsSelected()) {
      this.msgSvc.warning(`The batch processing is empty!\n`);
      this.msgSvc.dialog.afterAllClosed.subscribe(result => {
        this.router.navigate(['/batch'])
      })
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}
