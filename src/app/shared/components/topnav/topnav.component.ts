import { Component, Input } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BatchService } from 'src/app/components/batch/services/batch.service';

@Component({
  selector: 'pure-topnav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {

  constructor(private activatedRoute: ActivatedRoute, private bs: BatchService) {}

  do_some_navigation(target: string) {
    alert('navigating 2 ' + target);
  }

  addToBatchDatasets() {
    const savedSelection = this.activatedRoute.snapshot.routeConfig?.path + "-checked";
    this.bs.addToBatchDatasets(savedSelection);
    sessionStorage.removeItem(savedSelection);
    this.resetCheckBoxes();
  }

  removeFromBatchDatasets() {
    const savedSelection = this.activatedRoute.snapshot.routeConfig?.path + "-checked";
    this.bs.removeFromBatchDatasets(savedSelection);
    sessionStorage.removeItem(savedSelection);
    this.resetCheckBoxes();
  }

  resetCheckBoxes() {
    const checkBoxList = document.getElementsByClassName('form-check-input');
    for (let i = 0; i < checkBoxList.length; i++) {
      (checkBoxList[i] as HTMLInputElement).checked = false;
    }
  }

}