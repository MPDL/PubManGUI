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
import {ItemListComponent} from "../../item-list/item-list.component";
import {Observable, of, Subject} from "rxjs";
import {baseElasticSearchQueryBuilder} from "../../../shared/services/search-utils";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
  selector: 'pure-batch-datasets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemListElementComponent,
    NgbTooltip,
    PaginatorComponent,
    ItemListComponent
  ],
  templateUrl: './datasets.component.html'
})
export default class DatasetsComponent {


  searchQuery!: Subject<any>;


  constructor(
    public batchSvc: BatchService,
    private msgSvc: MessageService,
    public aaSvc: AaService,
    private router: Router
  ) {
    //this.datasets = this.batchSvc.getSelectedItems();
    this.searchQuery = new Subject();
    this.searchQuery.next(baseElasticSearchQueryBuilder("objectId", this.batchSvc.items));
    toObservable(this.batchSvc.getItemsCount).subscribe(o => {
      console.log("itemscount changes")
      this.searchQuery.next(baseElasticSearchQueryBuilder("objectId", this.batchSvc.items));
    })

  }

}
