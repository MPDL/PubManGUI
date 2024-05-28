import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';


interface NavOption {
  text: string;
  route: string;
}

@Component({
  selector: 'pure-batch-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule],
  templateUrl: './batch-nav.component.html'
})
export class BatchNavComponent {
  @Input() areItemsSelected = false;

  public navList: NavOption[] = [
    { route: '/batch/datasets', text: 'datasets' },
    { route: '/batch/actions', text: 'actions' },
    { route: '/batch/logs', text: 'logs' },
  ];

}
