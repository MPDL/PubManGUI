import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BatchService } from '../services/batch.service';

import { ItemListComponent } from "../../item-list/item-list.component";
// import { Subject} from "rxjs";
import { baseElasticSearchQueryBuilder } from "../../../shared/services/search-utils";
// import { toObservable } from "@angular/core/rxjs-interop";

import { Observable, of } from 'rxjs';

@Component({
  selector: 'pure-batch-datasets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemListComponent
  ],
  templateUrl: './datasets.component.html'
})
export default class DatasetsComponent {

  //searchQuery!: Subject<any>;
  searchQuery: Observable<any>;

  constructor(
    public batchSvc: BatchService,
    private router: Router
  ) {
    /*
    this.datasets = this.batchSvc.getSelectedItems();

    this.searchQuery = new Subject();
    this.searchQuery.next(baseElasticSearchQueryBuilder("objectId", this.batchSvc.items));
    toObservable(this.batchSvc.getItemsCount).subscribe(o => {
      console.log("itemscount changes")
      this.searchQuery.next(baseElasticSearchQueryBuilder("objectId", this.batchSvc.items));
    })
    */
    this.searchQuery = of({
      bool: {
        must: [
          baseElasticSearchQueryBuilder("objectId", this.batchSvc.items),
          {
            script: {
              script: "doc['latestVersion.versionNumber']==doc['versionNumber']"
            }
          }
        ]
      }
    })
  }

}