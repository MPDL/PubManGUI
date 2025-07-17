import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { EMPTY, mergeMap, of } from "rxjs";
import { MessageService } from "src/app/shared/services/message.service";
import { ImportsService } from 'src/app/components/imports/services/imports.service';

export const fetchItemResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const msgSvc = inject(MessageService);
    const importsSvc = inject(ImportsService);

    return importsSvc.getLastFetch().pipe(
        mergeMap(item => {
            if (item) {
                return of(item);
            } else {
                msgSvc.warning('Invalid import');
                router.navigate(['imports']);
                return EMPTY;
            }
        })
    );

}
