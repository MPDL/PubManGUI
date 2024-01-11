import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { of, mergeMap, EMPTY } from "rxjs";
import { MessageService } from "src/app/shared/services/message.service";
import { IngeCrudService } from "./inge-crud.service";

export const itemResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const service = inject(IngeCrudService);
    const message = inject(MessageService);
    const item_id = route.paramMap.get('id');
    const uri = '/items/' + item_id;

    return service.get(uri, undefined).pipe(
        mergeMap(item => {
            if (item) {
                return of(item);
            } else {
                message.warning('Invalid item id');
                router.navigate(['pure/pure']);
                return EMPTY;
            }
        })
    );
}
