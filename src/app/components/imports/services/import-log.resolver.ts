import type { ResolveFn } from '@angular/router';
import { inject } from "@angular/core";
import { ImportsService } from 'src/app/components/imports/services/imports.service';

export const importLogResolver: ResolveFn<boolean> = (route, state) => {
  const importsSvc = inject(ImportsService);
  // TO-DO for importLog
  return true;
};
