import { NgClass, isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, HostListener, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'pure-scroll-to-top',
  standalone: true,
  imports: [NgClass],
  templateUrl: './scroll-to-top.component.html'
})
export class ScrollToTopComponent {

  windowScrolled: boolean = false;
  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object) { }
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop > 100) {
        this.windowScrolled = true;
      }
      else if (this.windowScrolled && window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop < 10) {
        this.windowScrolled = false;
      }
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      let currentScroll = this.document.documentElement.scrollTop || this.document.body.scrollTop;
      if (currentScroll > 0) {
        window.scrollTo(0, 0);
      }
    }
  }
}
