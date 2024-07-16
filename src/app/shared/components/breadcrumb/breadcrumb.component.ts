import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';

export interface Breadcrumb {
  label: string,
  link: string
}

@Component({
  selector: 'pure-breadcrumb',
  standalone: true,
  imports: [
    CommonModule, RouterModule
  ],
  templateUrl: './breadcrumb.component.html'
})

export class BreadcrumbComponent { 
  breadcrumbs: Breadcrumb[] = [];
  isScrolled = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.breadcrumbs = [];
        this.buildBreadcrumb(this.activatedRoute);
      }
    });
  }

  buildBreadcrumb(currentAR: ActivatedRoute): void {
    if (currentAR.snapshot.data['breadcrumb']) {
      const lastBCLink =
        this.breadcrumbs.length !== 0
          ? this.breadcrumbs[this.breadcrumbs.length - 1].link
          : '';

      let currentBCLink = '';
      if (currentAR?.routeConfig?.path?.startsWith(':')) {
        currentBCLink = currentAR.snapshot.data['breadcrumb'].link;
      } else {
        currentBCLink = currentAR?.routeConfig?.path || '';
      }

      this.breadcrumbs.push({
        label: currentAR.snapshot.data['breadcrumb'].label,
        link: lastBCLink + '/' + currentBCLink,
      } as Breadcrumb);
    }

    if (currentAR.firstChild !== null) {
      this.buildBreadcrumb(currentAR.firstChild);
    }

    console.log("breadcrumb :\n" + JSON.stringify(this.breadcrumbs));
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
    console.log(this.isScrolled)
  }
}

