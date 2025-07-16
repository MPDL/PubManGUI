import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { EMPTY, mergeMap, of } from "rxjs";
import { MessageService } from "src/app/shared/services/message.service";
import { ItemsService } from "./items.service";
import { AaService } from "../aa.service";

export const itemResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
    const aaService = inject(AaService);
    const message = inject(MessageService);
    const router = inject(Router);
    const service = inject(ItemsService);

    const item_id = route.paramMap.get('id');

    if (item_id == null) {
        message.warning('Invalid item id');
        router.navigate(['pure/pure']);
        return EMPTY
    } else {
        return service.retrieve(item_id).pipe(
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
