import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AaService} from "./aa.service";
import {fromEvent, Subscription, tap} from "rxjs";
import {filter} from "rxjs/operators";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class WindowFocusCheckLoginService {

  enabled: boolean = true;

  private subs: Subscription | undefined;
  private platformId = inject(PLATFORM_ID);

  constructor(private aaService: AaService) {
    if (isPlatformBrowser(this.platformId)) {
      this.subs = fromEvent(window, 'focus').pipe(
        filter(() => this.enabled),
        tap(evt => {
          this.aaService.checkLoginChanged()
        })
      ).subscribe()
    }
  }

  onDestroy() {
    this.subs?.unsubscribe();
  }



}
