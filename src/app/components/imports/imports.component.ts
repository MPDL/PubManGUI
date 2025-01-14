import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ImportsNavComponent } from './imports-nav/imports-nav.component';
import { ImportsService } from './services/imports.service';

@Component({
  selector: 'pure-imports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ImportsNavComponent
  ],
  templateUrl: './imports.component.html',
})
export default class ImportsComponent implements OnInit {

  constructor(
    private importsSvc: ImportsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.importsSvc.hasImports()) {
      this.router.navigate(['/imports/myimports'])
    } else {
      this.router.navigate(['/imports/new'])
    }

  }
}  
