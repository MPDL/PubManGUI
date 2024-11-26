import { CommonModule } from '@angular/common';
import { Input, OnInit, DoCheck, AfterViewChecked, Component, QueryList, ViewChildren, HostListener } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, startWith } from 'rxjs';

import { ItemVersionVO } from 'src/app/model/inge';
import { AaService } from 'src/app/services/aa.service';
import { ItemsService} from "src/app/services/pubman-rest-client/items.service";
import { MessageService } from 'src/app/shared/services/message.service';

import { ItemListElementComponent } from 'src/app/components/item-list/item-list-element/item-list-element.component';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { PaginatorComponent} from "src/app/shared/components/paginator/paginator.component";

@Component({
  selector: 'pure-batch-datasets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemListElementComponent,
    PaginatorComponent
  ],
  templateUrl: './datasets.component.html'
})
export default class DatasetsComponent implements OnInit, DoCheck {
  @ViewChildren(ItemListElementComponent) list_items!: QueryList<ItemListElementComponent>;

  page = 1;
  pageSize = 25;
  datasets: ItemVersionVO[] = [];
  collectionSize = 0;
  inPage: ItemVersionVO[] = [];

  itemList: string[] = []; 
  select_all = new FormControl(false);

  isScrolled = false;

  constructor(
    private itemSvc: ItemsService, 
    private msgSvc: MessageService,
    public aaSvc: AaService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // required to work immediately.
      startWith(this.router)
    ).subscribe(() => {
      this.itemList = history.state['itemList'];
      this.items(this.itemList);
    });
  }

  items(itemList: string[]) {
    this.datasets = [];
    for (var itemObjectId of itemList) {
      if (itemObjectId) {
        this.itemSvc.retrieve(itemObjectId, this.aaSvc.token).subscribe( importResponse => {
          this.datasets.push(importResponse);
        })
      }
    };
    this.collectionSize = this.itemList.length;
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

  ngDoCheck(): void {
    this.paginatorChanged();
  }

  paginatorChanged() {
    this.inPage = this.datasets.map((_item, i) => ({ _id: i + 1, ..._item })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + (this.pageSize),
    );
  }
}
