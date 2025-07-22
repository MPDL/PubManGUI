import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'pure-info-subheader',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, NotificationComponent],
  templateUrl: './info-subheader.component.html'
})
export class InfoSubheaderComponent {
  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
