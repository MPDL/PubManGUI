import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStoreSimpleService<T> {

  private subject = new BehaviorSubject<T[]>([]);
  readonly data$ = this.subject.asObservable();

  getData(): T[] {
    return this.subject.getValue();
  }

  private setData(data: T[]): void {
    this.subject.next(data);
  }

  addData(item: T): void {
    const data = [...this.getData(), item];
    this.setData(data);
  }

  delData(prop: keyof T, value: any): void {
    const data = this.getData().filter(i => i[prop] !== value);
    this.setData(data);
  }

  updData(item: T, prop: keyof T): void {
    const data = this.getData().map(i =>
      i[prop] === item[prop] ? item : i
    );
    this.setData(data);
  }
}
