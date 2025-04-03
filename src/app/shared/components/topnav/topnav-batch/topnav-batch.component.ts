import {Component, Input} from '@angular/core';
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
    //RouterLink
  ],
  templateUrl: './topnav-batch.component.html',
})
export class TopnavBatchComponent {

  @Input() resetSelectionAfterAction: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private message: MessageService,
    private batchSvc: BatchService,
    protected aaService: AaService,
    private itemSelectionService:ItemSelectionService) {}

  addToBatchDatasets() {
   const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected) {
      const added = this.batchSvc.addToBatchDatasets(selected);
      if(this.resetSelectionAfterAction)
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
      if(this.resetSelectionAfterAction)
        this.itemSelectionService.resetList();
      this.message.success(selected.length + ' ' + $localize`:@@batch.datasets.selected:item/items selected` + '\n' + removed + ' ' + $localize`:@@batch.datasets.removed:item/items removed from batch processing` + ((selected.length! - removed) > 0 ? ", " + `${selected.length! - removed} ` + $localize`:@@batch.datasets.missing:not on batch were ignored` + "." : ''));
    } else {
      this.message.warning($localize`:@@batch.datasets.empty:The batch processing is empty`+'!');
    }
  }

  get isAdd() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0)
    {
      return selected.some(id => !this.batchSvc.objectIds.includes(id))
    }
    return false;
  }

  get isRemove() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0) {
      return selected.some(id => this.batchSvc.objectIds.includes(id))
    }
    return false;
  }

}
