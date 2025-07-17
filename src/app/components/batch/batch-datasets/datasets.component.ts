import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from "rxjs";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from '../services/batch.service';

import { ItemListComponent } from "../../item-list/item-list.component";
import { baseElasticSearchQueryBuilder } from "../../../shared/services/search-utils";


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


  searchQuery: Observable<any>;

  constructor(
    public batchSvc: BatchService
  ) {

    /*
    this.searchQuery = of({
      bool: {
        must: [
          baseElasticSearchQueryBuilder("objectId", batchSvc.items),
          {
            script: {
              script: "doc['latestVersion.versionNumber']==doc['versionNumber']"
            }
          }
        ]
      }
    })
    */

    this.searchQuery = batchSvc.objectIds$.pipe(
      map(objIds => {
        return baseElasticSearchQueryBuilder("objectId", batchSvc.items);
      }))

  }

}
