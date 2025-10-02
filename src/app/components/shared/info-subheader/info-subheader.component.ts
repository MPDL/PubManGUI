import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, inject } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NotificationComponent } from '../notification/notification.component';
import { Message, MessageService } from "../../../services/message.service";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: 'pure-info-subheader',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, NotificationComponent],
  templateUrl: './info-subheader.component.html'
})
export class InfoSubheaderComponent {
  isScrolled = false;

  currentMessage?: Message;
  private messageSvc = inject(MessageService);
  private router: Router = inject(Router);

  private destroy$: Subject<boolean> = new Subject<boolean>();



  constructor() {

    //Remove message after navigating to another page
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e instanceof NavigationEnd),
        tap((e) => {
          if(this.currentMessage && !this.currentMessage.keepAfterNavigation) {
            this.currentMessage = undefined;
          }

        }),

      )
      .subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onAreaMessage = effect(() => {
    this.currentMessage = this.messageSvc.lastMessage();
    return true;
  });

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
