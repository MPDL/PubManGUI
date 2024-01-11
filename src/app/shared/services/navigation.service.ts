import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, map, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  previous: string | undefined;
  private home = '/';

  constructor(
    private readonly location: Location,
    private readonly router: Router
  ) {
    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      map(e => e as RoutesRecognized),
      pairwise()
    ).subscribe(
      (events: [RoutesRecognized, RoutesRecognized]) => {
        this.previous = events[0].urlAfterRedirects;
      }
    )
  }

  public back(): void {
    if (this.previous !== undefined) {
      this.location.back();
    } else {
      this.router.navigate([this.home], { replaceUrl: true });
    }
  }
}
