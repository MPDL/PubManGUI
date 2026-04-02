import {CommonModule} from '@angular/common';
import {Component, HostListener, inject} from '@angular/core';
import {BreadcrumbComponent} from '../breadcrumb/breadcrumb.component';
import {NotificationComponent} from '../notification/notification.component';
import {MessageService} from "../../../services/message.service";
import {Subject} from "rxjs";

@Component({
  selector: 'pure-info-subheader',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, NotificationComponent],
  templateUrl: './info-subheader.component.html'
})
export class InfoSubheaderComponent {
  isScrolled = false;

  protected messageSvc = inject(MessageService);
  private destroy$: Subject<boolean> = new Subject<boolean>();



  constructor() {


  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /*
  public onAreaMessage = effect(() => {
    this.currentMessage = this.messageSvc.lastMessage();
    return true;
  });

   */

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
