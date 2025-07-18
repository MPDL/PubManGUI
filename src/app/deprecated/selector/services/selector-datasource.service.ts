import { Observable } from "rxjs";

export interface SelectedValue {
    selected: string
}

export abstract class SelectorDatasource<T extends SelectedValue> {

    abstract getOptions(searchValue$: Observable<string>): Observable<T[]>;
    abstract getControlValue(value: T): SelectedValue;
}
