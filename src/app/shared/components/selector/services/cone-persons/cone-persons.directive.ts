import { Directive, inject } from '@angular/core';
import { SelectorDatasource } from '../selector-datasource.service';
import { Observable, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { ConePerson, ConePersonsService } from './cone-persons.service';

@Directive({
    selector: '[pureConePersons]',
    providers: [
        {
            provide: SelectorDatasource,
            useExisting: ConePersonsDirective
        }
    ],
    standalone: true
})
export class ConePersonsDirective implements SelectorDatasource<ConePerson> {

    resource_path = '/persons/';

    service = inject(ConePersonsService)

    getOptions(searchValue$: Observable<string>): Observable<ConePerson[]> {
        return searchValue$.pipe(
            filter(typed => (typed != null && typed.length >= 3)),
            distinctUntilChanged(),
            debounceTime(500),
            switchMap((searchValue) => this.service.find(this.resource_path + searchValue)),
            map((persons) => persons.map(
                (person: any) => Object.assign(person, { selected: person.value })
            )));
    }

    getControlValue(value: ConePerson): ConePerson {
        value.selected = value.value;
        return value;
    }

}
