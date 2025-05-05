import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

interface Breadcrumb {
  labelKey: string;
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
      const currentRoute = children[0];
      const currentRouteLabelKey = currentRoute.data['breadcrumb'].labelKey;
      if (currentRouteLabelKey === 'common.view' || currentRouteLabelKey === 'common.edit') {
        const smallerCrumbs = this.removeUntilLastOccurence(currentRouteLabelKey, this.breadcrumbs$.getValue());
        this.breadcrumbs$.next(smallerCrumbs);

      } else if (currentRouteLabelKey === 'header.search' && (this.breadcrumbs$.getValue()[0]?.labelKey) ==="header.advancedSearch") {
        const smallerCrumbs = this.removeUntilLastOccurence(currentRouteLabelKey, this.breadcrumbs$.getValue());
        this.breadcrumbs$.next(smallerCrumbs);
      }
      else {
        this.breadcrumbs$.next([]);

      }
      this.createHierarchicalChildBreadcrumbs(this.activatedRoute.snapshot,'',this.breadcrumbs$.getValue());
    }

  }

  private removeUntilLastOccurence(labelKey: string, breadcrumbs: Breadcrumb[]) {
    const index = breadcrumbs.findIndex(b => b.labelKey === labelKey);
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
        if (child.data['breadcrumb'].labelKey) {
          breadcrumbs.push({
            labelKey: child.data['breadcrumb'].labelKey,
            type: child.data['breadcrumb'].label,
            active: child.data['breadcrumb'].active ?? true,
            url: url
          });
        }

        this.createHierarchicalChildBreadcrumbs(child, url, breadcrumbs);
      }
    }


  }

}
