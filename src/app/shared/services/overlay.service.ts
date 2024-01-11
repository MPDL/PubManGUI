import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { OverlayReference } from './overlay-reference';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(
    private overlay: Overlay,
    private injector: Injector
    ) { }

  open<T, U>(component: ComponentType<T>, data: U): OverlayReference<T, U> {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      panelClass: 'overlay-panel'
    });

    const overlayReference = new OverlayReference<T, U>(overlayRef, component, data);

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: OverlayReference, useValue: overlayReference }
      ]
    });

    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    return overlayReference;
  }

}
