import { CommonModule } from '@angular/common';
import { OnInit, Component, QueryList, ViewChildren, HostListener, AfterViewChecked } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemVersionVO } from 'src/app/model/inge';
import { AaService } from 'src/app/services/aa.service';
import { ItemsService} from "src/app/services/pubman-rest-client/items.service";
import { MessageService } from 'src/app/shared/services/message.service';
import { BatchService } from '../services/batch.service';

import { ItemListElementComponent } from 'src/app/components/item-list/item-list-element/item-list-element.component';
import { Router } from '@angular/router';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { PaginatorComponent} from "src/app/shared/components/paginator/paginator.component";

@Component({
  selector: 'pure-batch-datasets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemListElementComponent,
    NgbTooltip,
    PaginatorComponent
  ],
  templateUrl: './datasets.component.html'
})
export default class DatasetsComponent implements OnInit, AfterViewChecked { 
  @ViewChildren(ItemListElementComponent) list_items!: QueryList<ItemListElementComponent>;

  protected currentPage = 1;
  protected pageSize = 25;
  datasets: ItemVersionVO[] = [];
  collectionSize = 0;
  inPage: ItemVersionVO[] = [];

  select_all = new FormControl(false, {
    nonNullable: true,
  });

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
    this.datasets = this.batchSvc.getSelectedItems();
  }

  ngAfterViewChecked(): void {
    this.collectionSize = this.datasets.length;
    this.paginatorChanged();
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
    this.datasets = this.batchSvc.getSelectedItems();
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

  paginatorChanged() {
    this.inPage = this.datasets.map((_item, i) => ({ _id: i + 1, ..._item })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + (this.pageSize),
    );
  }
}
