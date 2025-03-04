import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { of, mergeMap, EMPTY } from "rxjs";
import { ImportsService } from 'src/app/components/imports/services/imports.service';

export const fetchItemResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const importsSvc = inject(ImportsService);

    return importsSvc.getLastFetch().pipe(
        mergeMap(item => {
            if (item) {
                return of(item);
            } else {
                router.navigate(['imports']);
                return EMPTY; 
            }
        })
    );

}
