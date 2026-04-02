import {Directive, inject} from '@angular/core';
import {MatomoTracker} from "ngx-matomo-client";
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[pureMatomoOptOut]',
  exportAs: 'pureMatomoOptOutDirective',
})
export class MatomoOptOutDirective {

  private matomoTracker = inject(MatomoTracker);
  matomoOptInSelected = true;

  constructor(checkboxControl: NgControl) {
    console.log("matomoOptOut", checkboxControl);
    checkboxControl.control?.setValue(true);
    this.matomoTracker.isUserOptedOut().then(val => this.matomoOptInSelected = !val);
  }

  matomoOptInChange(val: boolean) {
    console.log("matomo change",val);
    if(val) {
      this.matomoOptInSelected = true;
      this.matomoTracker.forgetUserOptOut();
    }
    else {
      this.matomoOptInSelected = false;
      this.matomoTracker.optUserOut();
    }
  }

}
