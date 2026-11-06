/// <reference types="@angular/localize" />

// Bootstrap's data-api for `data-bs-toggle="collapse"` (accordions and FAQ sections).
// Only this component is imported; the rest of Bootstrap's JS and Popper are not used
// by the app (menus, modals, tooltips and popovers come from @ng-bootstrap).
import 'bootstrap/js/dist/collapse';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
