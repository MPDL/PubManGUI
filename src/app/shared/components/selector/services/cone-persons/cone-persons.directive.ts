import { Directive, inject } from '@angular/core';
import { SelectorDatasource } from '../selector-datasource.service';
import { debounceTime, distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { ConePerson, ConePersonsService } from './cone-persons.service';
import { HttpParams } from '@angular/common/http';

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
            switchMap((searchValue) => {
                const params = new HttpParams().set('q', searchValue).set('format', 'json');
                return this.service.find(this.resource_path + "query", params)}),
            map((persons) => persons.map(
                (person: any) => Object.assign(person, { selected: person.value })
            )));
    }

    getControlValue(value: ConePerson): ConePerson {
        value.selected = value.value;
        return value;
    }

}
