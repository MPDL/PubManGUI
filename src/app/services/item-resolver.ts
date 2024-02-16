import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { of, mergeMap, EMPTY } from "rxjs";
import { MessageService } from "src/app/shared/services/message.service";
import { ItemsService } from "./items.service";

export const itemResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const service = inject(ItemsService);
    const message = inject(MessageService);
    const item_id = route.paramMap.get('id');

    if (item_id == null) {
        message.warning('Invalid item id');
        router.navigate(['pure/pure']);
        return EMPTY
    } else {
        return service.getItem(item_id, undefined).pipe(
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
}
