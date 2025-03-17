import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

interface Breadcrumb {
  label: string;
  type: string;
  active: boolean;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);
  private routerSubscription: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(ev => {
      this.createBreadcrumbs();

    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  getBreadcrumbs(): Observable<Breadcrumb[]> {
    return this.breadcrumbs$;
    /*
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.createBreadcrumbs(this.router.routerState.snapshot.root))
    );
     */
  }

  private createBreadcrumbs() {

    const children: ActivatedRouteSnapshot[] = this.activatedRoute.snapshot.children;
    if(children.length > 0) {
      const firstChild = children[0];
      const firstChildLabel = firstChild.data['breadcrumb'].label;
      if (firstChildLabel === 'View' || firstChildLabel === 'Edit') {
        const smallerCrumbs = this.removeUntilLastOccurence(firstChildLabel, this.breadcrumbs$.getValue());
        this.breadcrumbs$.next(smallerCrumbs);

      } else if (firstChildLabel === 'Search' && (this.breadcrumbs$.getValue()[0]?.type) ==="Advanced Search") {
        //leave advanced search in
      }
      else {
        this.breadcrumbs$.next([]);

      }
      this.createHierarchicalChildBreadcrumbs(this.activatedRoute.snapshot,'',this.breadcrumbs$.getValue());
    }

  }

  private removeUntilLastOccurence(type: string, breadcrumbs: Breadcrumb[]) {
    const index = breadcrumbs.findIndex(b => b.type === type);
    if(index > -1) {
      return breadcrumbs.slice(0, index);
    }
    return breadcrumbs;



  }

  private createHierarchicalChildBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[]) {

    const children = route.children;
    if (children.length > 0) {

      for (const child of children) {
        const routeURL: string = child.url.map(segment => segment.path).join('/');
        if (routeURL !== '') {
          url += `/${routeURL}`;
        }
        if (child.data['breadcrumb'].label) {
          breadcrumbs.push({
            label: this.getLocalizedLabel(child.data['breadcrumb'].label),
            type: child.data['breadcrumb'].label,
            active: child.data['breadcrumb'].active ?? true,
            url: url
          });
        }

        this.createHierarchicalChildBreadcrumbs(child, url, breadcrumbs);
      }
    }


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
