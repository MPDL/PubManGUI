import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Breadcrumb {
  label: string;
  active: boolean;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  constructor(private router: Router) {}

  getBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.createBreadcrumbs(this.router.routerState.snapshot.root))
    );
  }

  private createBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRouteSnapshot[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      if (child.data['breadcrumb'].label) {
      breadcrumbs.push({
        label: this.getLocalizedLabel(child.data['breadcrumb'].label),
        active: child.data['breadcrumb'].active ?? true,
        url: url
      });}

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

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
      case 'My imports':
          localizedlabel = $localize`:@@myimports:My imports`;
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