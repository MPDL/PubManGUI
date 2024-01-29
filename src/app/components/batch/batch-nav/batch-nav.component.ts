import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavItem {
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
  
  public navItems: NavItem[] = [
    { route: '/list', text: 'Datasets' },
    { route: '/batch/actions', text: 'Actions' },
    { route: '/batch/protocols', text: 'Protocols' },
  ];
}
