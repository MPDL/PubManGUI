import { Component, Input, inject } from '@angular/core';
import { MessageService } from "../../../services/message.service";
import { BatchService } from "../../../../components/batch/services/batch.service";
import { AaService } from "../../../../services/aa.service";
import { ItemSelectionService } from "../../../services/item-selection.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from "@ngx-translate/core";

@Component({
  selector: 'pure-topnav-batch',
  standalone: true,
  imports: [
    NgbTooltip,
    TranslatePipe
  ],
  templateUrl: './topnav-batch.component.html',
})
export class TopnavBatchComponent {

  @Input() resetSelectionAfterAction: boolean = true;

  batchSvc = inject(BatchService);
  msgSvc = inject(MessageService);
  aaService = inject(AaService);
  itemSelectionService = inject(ItemSelectionService);
  translateSvc = inject(TranslateService);

  addToBatchDatasets() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected) {
      const added = this.batchSvc.addToBatchDatasets(selected);
      if (this.resetSelectionAfterAction)
        this.itemSelectionService.resetList();
      this.msgSvc.success(selected.length + ' ' 
        + this.translateSvc.instant(_('batch.datasets.selected')) + '\n' + added + ' ' 
        + this.translateSvc.instant(_('batch.datasets.filled')) 
        + ((selected.length! - added) > 0 ? ", " + `${selected.length! - added} ` 
        + this.translateSvc.instant(_('batch.datasets.duplicated'))  + "." : '')
      );
    } else {
      this.msgSvc.warning(this.translateSvc.instant(_('batch.datasets.empty')) + '!');
    }
  }

  removeFromBatchDatasets() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected) {
      const removed = this.batchSvc.removeFromBatchDatasets(selected);
      if (this.resetSelectionAfterAction)
        this.itemSelectionService.resetList();
      this.msgSvc.success(selected.length + ' ' 
        + this.translateSvc.instant(_('batch.datasets.selected')) + '\n' + removed + ' ' 
        + this.translateSvc.instant(_('batch.datasets.removed')) 
        + ((selected.length! - removed) > 0 ? ", " + `${selected.length! - removed} ` 
        + this.translateSvc.instant(_('batch.datasets.missing')) + "." : '')
      );
    } else {
      this.msgSvc.warning(this.translateSvc.instant(_('batch.datasets.empty')) + '!');
    }
  }

  get isAdd() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected.length > 0) {
      return selected.some(id => !this.batchSvc.objectIds.includes(id))
    }
    return false;
  }

  get isRemove() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected.length > 0) {
      return selected.some(id => this.batchSvc.objectIds.includes(id))
    }
    return false;
  }

}
