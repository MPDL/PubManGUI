import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavOption {
  text : string;
  route: string;
}

@Component({
  selector: 'pure-batch-nav',
  standalone: true,
  imports: [ 
    CommonModule, 
    RouterModule ],
  templateUrl: './batch-nav.component.html'
})
export class BatchNavComponent {
  
  public navList: NavOption[] = [
    { route: '/batch/datasets', text: 'Datasets' },
    { route: '/batch/actions', text: 'Actions' },
    { route: '/batch/logs', text: 'Logs' },
  ];
}
