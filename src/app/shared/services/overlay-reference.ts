import { OverlayRef } from "@angular/cdk/overlay";
import { ComponentType } from "@angular/cdk/portal";
import { Observable, Subject } from "rxjs";

export interface OverlayCloseEvent<T> {
    action: 'backdropClick' | 'close';
    data: T;
}

export class OverlayReference<T = any, U = any> {
    private afterClosedSubject = new Subject<OverlayCloseEvent<T>>();

    constructor(
        private overlayRef: OverlayRef,
        public component: ComponentType<T>,
        public data: U
    ) {
        overlayRef.backdropClick().subscribe(() => this._close('backdropClick', undefined));
    }

    close(data?: T) {
        if (data) {
            this._close('close', data);
        } else {
            this._close('close');
        }
    }

    private _close(action: 'backdropClick' | 'close', data?: T) {
        this.overlayRef.dispose();
        if (data) this.afterClosedSubject.next({
            action,
            data
        });

        this.afterClosedSubject.complete();
    }

    public afterClosed(): Observable<any> {
        return this.afterClosedSubject.asObservable();
    }
}
