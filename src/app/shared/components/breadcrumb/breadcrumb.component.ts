import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { Observable, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

interface Breadcrumb {
  label: string;
  active: boolean;
  url: string;
} 

@Component({
  selector: 'pure-breadcrumb',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe
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