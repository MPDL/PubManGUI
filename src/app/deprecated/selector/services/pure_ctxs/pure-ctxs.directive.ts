import { Directive, inject } from '@angular/core';
import { SelectorDatasource } from '../selector-datasource.service';
import { Ctx, PureCtxsService } from './pure-ctxs.service';
import { Observable, switchMap } from 'rxjs';

@Directive({
  selector: '[purePureCtxs]',
  providers: [
    {
      provide: SelectorDatasource,
      useExisting: PureCtxsDirective
    }
  ],
  standalone: true
})
export class PureCtxsDirective implements SelectorDatasource<Ctx> {

  service = inject(PureCtxsService);

  getOptions(searchValue$: Observable<string>) {
    return searchValue$.pipe(
      switchMap((searchValue) => this.service.getCtxs(searchValue)
      ),
    );
  }

  getControlValue(value: Ctx): Ctx {
    return value;
  }

}
