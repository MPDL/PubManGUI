import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImportsService } from '../services/imports.service';

@Component({
  selector: 'pure-imports-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './list.component.html'
})
export default class ListComponent { 

  constructor(
    private importsSvc: ImportsService) { }

}
