import { Component, Input } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'pure-topnav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topnav.component.html'
})
export class TopnavComponent {

  constructor(
    private activatedRoute: ActivatedRoute, 
    private message: MessageService, 
    private bs: BatchService) {}

  do_some_navigation(target: string) {
    alert('navigating 2 ' + target);
  }

  addToBatchDatasets() {
    const savedSelection = this.activatedRoute.snapshot.routeConfig?.path + "-checked";
    const selected = sessionStorage.getItem(savedSelection) ? JSON.parse(sessionStorage.getItem(savedSelection)!).length : 0;
    if (selected) {
      const added = this.bs.addToBatchDatasets(savedSelection);
      sessionStorage.removeItem(savedSelection);
      this.resetCheckBoxes();

      this.message.success(selected + ' items selected' + ((selected! - added) > 0 ? `, ${selected! - added} on batch duplicated were ignored.` : ''));
    } else {
      this.message.warning(`The batch processing is empty!\n`);
    }

  }

  removeFromBatchDatasets() {
    const savedSelection = this.activatedRoute.snapshot.routeConfig?.path + "-checked";
    const selected = sessionStorage.getItem(savedSelection) ? JSON.parse(sessionStorage.getItem(savedSelection)!).length : 0;
    if (selected) {
      const removed = this.bs.removeFromBatchDatasets(savedSelection);
      sessionStorage.removeItem(savedSelection);
      this.resetCheckBoxes();

      this.message.success(selected + ' items selected' + ((selected! - removed) > 0 ? `, ${selected! - removed} not on batch were ignored.` : ''));
    } else {
      this.message.warning(`The batch processing is empty!\n`);
    }
  }

  resetCheckBoxes() {
    const checkBoxList = document.getElementsByClassName('form-check-input');
    for (let i = 0; i < checkBoxList.length; i++) {
      (checkBoxList[i] as HTMLInputElement).checked = false;
    }
  }

}