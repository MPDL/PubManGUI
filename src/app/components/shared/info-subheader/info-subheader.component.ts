import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, inject } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NotificationComponent } from '../notification/notification.component';
import { MessageService } from "../../../services/message.service";

@Component({
  selector: 'pure-info-subheader',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, NotificationComponent],
  templateUrl: './info-subheader.component.html'
})
export class InfoSubheaderComponent {
  isScrolled = false;

  currentMessage: any = {};
  private messageSvc = inject(MessageService);

  public onAreaMessage = effect(() => {
    this.currentMessage = this.messageSvc.lastMessage();
    /*
    this.collapsed = this.message?.collapsed;
    this.dress(this.message);

     */
    return true;
  });

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
