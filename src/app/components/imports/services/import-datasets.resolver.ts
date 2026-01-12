import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { EMPTY, mergeMap, of } from "rxjs";
import { MessageService } from "src/app/services/message.service";
import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { _, TranslateService } from "@ngx-translate/core";


export const importDatasetsResolver: ResolveFn<String[]> = (route, state) => {
  const router = inject(Router);
  const msgSvc = inject(MessageService);
  const importsSvc = inject(ImportsService);
  const translateSvc = inject(TranslateService);

  try {
    return importsSvc.getImportLogItems(Number(route.paramMap.get('importId'))).pipe(
      mergeMap(response => {
        if (response.length > 0) {
          let items: string[] = [];
          response.sort((a, b) => a.id - b.id)
            .forEach(element => {
              if (element.itemId) {
                items.push(element.itemId);
              }
            });
          return of(items);
        } else {
          const msg = translateSvc.instant(_('imports.list.items.empty')) + '\n';
          msgSvc.info(msg);
          return EMPTY;
        }
      }));
  } catch {
    return EMPTY;
  }
}