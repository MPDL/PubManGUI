import { HostListener, Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AaService } from "./aa.service";
import { fromEvent, tap } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WindowFocusCheckLoginService {

  enabled: boolean = true;

  private subs;
  constructor(private aaService: AaService) {
    this. subs = fromEvent(window, 'focus').pipe(
      filter(() => this.enabled),
      tap(evt => {
        this.aaService.checkLoginChanged()
      })
    ).subscribe()
  }

  onDestroy() {
    this.subs.unsubscribe();
  }



}
