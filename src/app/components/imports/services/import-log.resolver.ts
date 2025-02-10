import { ResolveFn } from '@angular/router';
import { EMPTY } from "rxjs";
import { inject } from "@angular/core";
import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogDbVO } from 'src/app/model/inge';

export const importLogResolver: ResolveFn<ImportLogDbVO> = (route, state) => {
  const importsSvc = inject(ImportsService);

  try {
    return importsSvc.getImportLog(Number(route.paramMap.get('importId')));
  } catch {
    return EMPTY;
  }
};