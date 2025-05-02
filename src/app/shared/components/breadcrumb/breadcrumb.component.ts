import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { Observable, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { TranslatePipe } from "@ngx-translate/core";

interface Breadcrumb {
  labelKey: string;
  active: boolean;
  url: string;
} 

@Component({
  selector: 'pure-breadcrumb',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    TranslatePipe
  ],
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]> = of([]);

  constructor(private breadcrumbSvc: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbSvc.getBreadcrumbs();
  }
}