import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink, Router} from "@angular/router";
import {MessageService} from "../../../services/message.service";
import {BatchService} from "../../../../components/batch/services/batch.service";
import {AaService} from "../../../../services/aa.service";
import {ItemSelectionService} from "../../../services/item-selection.service";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

import { baseElasticSearchQueryBuilder } from "../../../../shared/services/search-utils";
import { Observable, of } from 'rxjs';

@Component({
  selector: 'pure-topnav-batch',
  standalone: true,
  imports: [
    NgbTooltip,
    //RouterLink
  ],
  templateUrl: './topnav-batch.component.html',
})
export class TopnavBatchComponent {
  searchQuery: Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private batchSvc: BatchService,
    protected aaService: AaService,
    private itemSelectionService:ItemSelectionService) {
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

  addToBatchDatasets() {
   const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected) {
      const added = this.batchSvc.addToBatchDatasets(selected);
      this.itemSelectionService.resetList();
      this.message.success(selected.length + ' ' + $localize`:@@batch.datasets.selected:item/items selected` + '\n' + added + ' ' + $localize`:@@batch.datasets.filled:item/items added to batch processing` + ((selected.length! - added) > 0 ? ", " + `${selected.length! - added} ` + $localize`:@@batch.datasets.duplicated:on batch duplicated were ignored` + "." : ''));
    } else {
      this.message.warning($localize`:@@batch.datasets.empty:The batch processing is empty`+'!');
    }

  }

  removeFromBatchDatasets() {
   const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected) {
      const removed = this.batchSvc.removeFromBatchDatasets(selected);
      this.itemSelectionService.resetList();
      this.message.success(selected.length + ' ' + $localize`:@@batch.datasets.selected:item/items selected` + '\n' + removed + ' ' + $localize`:@@batch.datasets.removed:item/items removed from batch processing` + ((selected.length! - removed) > 0 ? ", " + `${selected.length! - removed} ` + $localize`:@@batch.datasets.missing:not on batch were ignored` + "." : ''));
    } else {
      this.message.warning($localize`:@@batch.datasets.empty:The batch processing is empty`+'!');
    }
    // TODO Refresh dataset list
    this.router.navigate(['/batch/datasets']); //, { state: { itemList: this.batchSvc.items } });
  }

  get isAdd() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0)
    {
      return selected.some(id => !this.batchSvc.objectIds.includes(id))
    }
    return false;
    //console.log("isAdd: " + isAdd)
    //return isAdd
  }
  get isRemove() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0) {
      return selected.some(id => this.batchSvc.objectIds.includes(id))
    }
    return false;
  }

}