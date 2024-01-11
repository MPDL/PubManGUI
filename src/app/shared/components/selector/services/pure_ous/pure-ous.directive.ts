import { Directive, inject } from '@angular/core';
import { SelectorDatasource } from '../selector-datasource.service';
import { OU, PureOusService } from './pure-ous.service';
import { Observable, switchMap } from 'rxjs';

@Directive({
    selector: '[purePureOus]',
    providers: [
        {
            provide: SelectorDatasource,
            useExisting: PureOusDirective
        }
    ],
    standalone: true
})
export class PureOusDirective implements SelectorDatasource<OU> {

  service = inject(PureOusService);

  getOptions(searchValue$: Observable<string>) {
    return searchValue$.pipe(
      switchMap((searchValue) => this.service.getOUs(searchValue)
      ),
    );
  }

  getControlValue(value: OU): OU {
    return value;
  }
}
