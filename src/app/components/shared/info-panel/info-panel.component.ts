import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MessagingComponent } from '../messaging/messaging.component';

@Component({
  selector: 'pure-info-panel',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, MessagingComponent],
  templateUrl: './info-panel.component.html'
})
export class InfoPanelComponent {
  isScrolled = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
