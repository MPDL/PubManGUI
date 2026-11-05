import { ChangeDetectionStrategy, Component, DestroyRef, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgbActiveOffcanvas, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from "@ngx-translate/core";

import { AaService } from '../../../../services/aa.service';
import { SidenavOptionsComponent } from '../sidenav-options/sidenav-options.component';
import { ToolsnavComponent } from '../../toolsnav/toolsnav.component';

@Component({
  selector: 'pure-sidenav-mobile',
  standalone: true,
  imports: [
    RouterLink,
    TranslatePipe,
    NgbPopover,
    NgbTooltip,
    SidenavOptionsComponent,
    ToolsnavComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './sidenav-mobile.component.html',
  host: { class: 'sidenav-mobile-content' }
})
export class SidenavMobileComponent {

  aaService = inject(AaService);
  private activeOffcanvas = inject(NgbActiveOffcanvas);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  private mediaQuery: MediaQueryList | null = null;
  private readonly openedUrl = this.router.url;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      // only close on an actual route change, not on a navigation that was already in flight
      if (event instanceof NavigationEnd && event.urlAfterRedirects !== this.openedUrl) {
        this.activeOffcanvas.close();
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.mediaQuery = window.matchMedia('(min-width: 992px)');
      this.mediaQuery.addEventListener('change', this.onMediaChange);
      this.destroyRef.onDestroy(() => this.mediaQuery?.removeEventListener('change', this.onMediaChange));
    }
  }

  private onMediaChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      this.activeOffcanvas.close();
    }
  };

  close() {
    this.activeOffcanvas.close();
  }

}
