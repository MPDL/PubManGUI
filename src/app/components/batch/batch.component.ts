import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { BatchNavComponent } from './batch-nav/batch-nav.component';
import { BatchService } from './services/batch.service';

@Component({
  selector: 'pure-batch',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BatchNavComponent
  ],
  templateUrl: './batch.component.html',
})
export default class BatchComponent implements OnInit {

  constructor(
    private batchSvc: BatchService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.batchSvc.areItemsSelected()) {
      this.router.navigate(['/batch/datasets'])
    } else {
      this.router.navigate(['/batch/logs'])
    }
  }
}  
