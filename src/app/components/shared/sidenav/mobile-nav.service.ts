import { Injectable, inject, signal } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';

import { SidenavMobileComponent } from './sidenav-mobile/sidenav-mobile.component';

@Injectable({ providedIn: 'root' })
export class MobileNavService {

  private offcanvas = inject(NgbOffcanvas);

  readonly isOpen = signal(false);
  private ref: NgbOffcanvasRef | null = null;

  open() {
    if (this.ref) return;
    this.ref = this.offcanvas.open(SidenavMobileComponent, {
      position: 'start',
      panelClass: 'sidenav-mobile',
      ariaLabelledBy: 'sidenavMobileLabel',
    });
    this.ref.result
      .finally(() => {
        this.ref = null;
        this.isOpen.set(false);
      })
      // dismissals (backdrop/ESC) reject the result promise - swallow it
      .catch(() => {});

    this.isOpen.set(true);
  }

  close() {
    this.ref?.dismiss();
  }

}
