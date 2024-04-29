import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, throwError, filter, map, startWith, tap, of } from 'rxjs';

import { ItemVersionVO } from 'src/app/model/inge';
import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BatchNavComponent } from '../batch-nav/batch-nav.component';
import { BatchService } from '../services/batch.service';

import { PaginationDirective } from 'src/app/shared/directives/pagination.directive';
import { ItemListElementComponent } from 'src/app/components/item-list/item-list-element/item-list-element.component';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'pure-batch-datasets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BatchNavComponent,
    PaginationDirective,
    ItemListElementComponent
  ],
  templateUrl: './datasets.component.html'
})
export class DatasetsComponent implements AfterViewInit { 
  @ViewChildren(ItemListElementComponent) list_items!: QueryList<ItemListElementComponent>;

  result_list: Observable<ItemVersionVO[]> | undefined;
  select_all = new FormControl(false);

    // Pagination:
    page_size = 10;
    number_of_pages = 1;
    current_page = 1;
    jump_to = this.current_page;
  
    update_query = (query: any) => {
      return {
        query,
        size: this.page_size,
        from: 0
      }
    }
  
    current_query: any;

  private isProcessing: boolean = false;

  constructor(
    private bs: BatchService, 
    private message: MessageService, 
    public aa: AaService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    console.log("on Datasets");
    this.bs.getBatchProcessUserLock().subscribe({
      next: () => this.isProcessing = true,
      error: () => this.isProcessing = false
    })

    if (this.isProcessing) {
      const msg = `Please wait, a process is runnig!\n`;
      this.message.error(msg);
      throwError(() => msg);
    };

    this.items(this.bs.items);

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // required to work immediately.
      startWith(this.router)
    ).subscribe(() => {
      this.items(this.bs.items);
    });

  }

  items(itemList: string[]) {
    const results: ItemVersionVO[] = []; 
    for(var element of itemList) { 
      if (element) {
        this.bs.getItem(element).subscribe(actionResponse => results.push(actionResponse));   
      }
    };
    console.log(JSON.stringify(results));
    this.result_list = of(results);
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
    this.current_page = page_number;
    const from = page_number * this.page_size - this.page_size;
    this.current_query.size = this.page_size;
    this.current_query.from = from;
    this.items(this.current_query);
  }

  select_all_items(event: any) {
    if (event.target.checked) {
      this.list_items.map(li => li.check_box.setValue(true));
    } else {
      this.list_items.map(li => li.check_box.setValue(false));
    }
  }

  removeChecked() {
      // const checked_list = JSON.parse(sessionStorage.getItem(this.bs.savedSelection) as string);
      // if (checked_list) {
      //  console.log("Remove checked items: \n" + checked_list);
      //  let item_list: string[] = this.bs.items;
      //  console.log("from: \n" + item_list);
      //  for(var element of item_list) { 
      //    if (element) {
            this.bs.removeFromBatchDatasets(this.bs.savedSelection);
      //    }
      //  };
        this.items(this.bs.items);
      //  console.log("result: \n" + item_list);
      sessionStorage.removeItem(this.bs.savedSelection);
      // }
  }

}
