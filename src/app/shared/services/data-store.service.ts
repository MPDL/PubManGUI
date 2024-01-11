import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService<T> {

  private subject = new BehaviorSubject<T[]>([]);
  private store: {data: T[]} = {data: []};
  readonly data = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  list(uri: string): void {
    if (this.store.data.length > 0) {
      this.store.data = [];
      this.subject.next(Object.assign({}, this.store).data);
    }
    this.http.get<T[]>(uri).subscribe({
      next: (list) => {
        this.store.data = list;
        this.subject.next(Object.assign({}, this.store).data);
      },
      error: (error) => this.message.error(error)
    });
  }

  get(uri: string, property: keyof T): void {
    this.http.get<T>(uri).subscribe({
      next: (data) => {
        let inStore = false;
        this.store.data.forEach((v, i) => {
          if (v[property] === data[property]) {
            this.store.data[i] = data;
            inStore = true;
          }
        });
        if (!inStore) {
          this.store.data.push(data);
        }
        this.subject.next(Object.assign({}, this.store).data);
      },
      error: (error) => this.message.error(error)
    });
  }

  create(uri: string, body: T): void {
    this.http.post<T>(uri, body).subscribe({
      next: (data) => {
        this.store.data.push(data);
        this.subject.next(Object.assign({}, this.store).data);
      },
      error: (error) => this.message.error(error)
    });
  }

  update(uri: string, body: T, property: keyof T): void {
    this.http.patch<T>(uri, body).subscribe({
      next: (data) => {
        this.store.data.forEach((v, i) => {
          if (v[property] === data[property]) {
            this.store.data[i] = data;
          }
        });
        this.subject.next(Object.assign({}, this.store).data);
      },
      error: (error) => this.message.error(error)
    });
  }

  delete(uri: string, id: any, property: keyof T): void {
    this.http.delete(uri).subscribe({
      next: () => {
        this.store.data.forEach((v, i) => {
          if (v[property] === id) {
            this.store.data.splice(i, 1);
          }
        });
        this.subject.next(Object.assign({}, this.store).data);
      },
      error: (error) => this.message.error(error)
    });
  }
}
