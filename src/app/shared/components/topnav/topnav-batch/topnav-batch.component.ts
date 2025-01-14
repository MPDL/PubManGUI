import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MessageService} from "../../../services/message.service";
import {BatchService} from "../../../../components/batch/services/batch.service";
import {AaService} from "../../../../services/aa.service";
import {ItemSelectionService} from "../../../services/item-selection.service";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-topnav-batch',
  standalone: true,
  imports: [
    NgbTooltip,
    RouterLink
  ],
  templateUrl: './topnav-batch.component.html',
})
export class TopnavBatchComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private message: MessageService,
    private bs: BatchService,
    protected aaService: AaService,
    private itemSelectionService:ItemSelectionService) {}

  addToBatchDatasets() {
    //const savedSelection = this.activatedRoute.snapshot.routeConfig?.path + "-checked";
    //const selected = sessionStorage.getItem(savedSelection) ? JSON.parse(sessionStorage.getItem(savedSelection)!).length : 0;
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected) {
      const added = this.bs.addToBatchDatasets(selected);
      //sessionStorage.removeItem(savedSelection);
      this.itemSelectionService.resetList();

      this.message.success(selected + ' items selected' + ((selected.length! - added) > 0 ? `, ${selected.length! - added} on batch duplicated were ignored.` : ''));
    } else {
      this.message.warning(`The batch processing is empty!\n`);
    }

  }

  removeFromBatchDatasets() {
    //const savedSelection = this.activatedRoute.snapshot.routeConfig?.path + "-checked";
    //const selected = sessionStorage.getItem(savedSelection) ? JSON.parse(sessionStorage.getItem(savedSelection)!).length : 0;
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected) {
      const removed = this.bs.removeFromBatchDatasets(selected);
      //sessionStorage.removeItem(savedSelection);
      this.itemSelectionService.resetList();

      this.message.success(selected + ' items selected' + ((selected.length! - removed) > 0 ? `, ${selected.length! - removed} not on batch were ignored.` : ''));
    } else {
      this.message.warning(`The batch processing is empty!\n`);
    }
  }

  get isAdd() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0)
    {
      return selected.some(id => !this.bs.objectIds.includes(id))
    }
    return false;
    //console.log("isAdd: " + isAdd)
    //return isAdd
  }
  get isRemove() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0) {
      return selected.some(id => this.bs.objectIds.includes(id))
    }
    return false;
  }

}
