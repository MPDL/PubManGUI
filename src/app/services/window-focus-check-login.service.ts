import { HostListener, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from "@angular/router";
import { AaService } from "./aa.service";
import { fromEvent, Subscription, tap } from "rxjs";
import { filter } from "rxjs/operators";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class WindowFocusCheckLoginService {

  enabled: boolean = true;

  private subs: Subscription | undefined;
  constructor() {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      const aaService = inject(AaService);
      this.subs = fromEvent(window, 'focus').pipe(
        filter(() => this.enabled),
        tap(evt => {
          aaService.checkLoginChanged()
        })
      ).subscribe()
    }
  }

  onDestroy() {
    this.subs?.unsubscribe();
  }



}
