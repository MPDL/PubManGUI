import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  separator = '>';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
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

      if (currentAR.snapshot.data['breadcrumb'].label) {
        this.breadcrumbs.push({
          label: this.getLocalizedLabel(currentAR.snapshot.data['breadcrumb'].label),
          link: lastBCLink + '/' + currentBCLink,
        } as Breadcrumb);
      }
    }

    if (currentAR.firstChild !== null) {
      this.buildBreadcrumb(currentAR.firstChild);
    }
  }

  // interim fix
  getLocalizedLabel(label: string): string {
    let localizedlabel = label;
    switch (label) {
      case 'My datasets':
        localizedlabel = $localize`:@@my:My datasets`;
        break;
      case 'QA Area':
        localizedlabel = $localize`:@@qa:QA Area`;
        break;
      case 'Basket':
        localizedlabel = $localize`:@@basket:Basket`;
        break;
      case 'Organizational units':
        localizedlabel = $localize`:@@ouTree:Organizational units`;
        break;
      case 'Entry':
        localizedlabel = $localize`:@@edit:Entry`;
        break;
      case 'Batch processing':
        localizedlabel = $localize`:@@batch:Batch processing`;
        break;
      case 'Search':
        localizedlabel = $localize`:@@search:Search`;
        break;
      case 'Advanced search':
        localizedlabel = $localize`:@@advancedSearch:Advanced search`;
        break;
      case 'Privacy Policy':
        localizedlabel = $localize`:@@privacyPolicy:Privacy Policy`;
    }
    return localizedlabel;
  }

}
