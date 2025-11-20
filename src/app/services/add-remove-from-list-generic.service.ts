
import {BehaviorSubject, fromEvent, Subscription, tap} from "rxjs";
import {AaService} from "./aa.service";
import {filter, map} from "rxjs/operators";
import {Injectable, OnDestroy, OnInit} from "@angular/core";

@Injectable()
export abstract class AddRemoveFromListGenericService {

  private localStorageKey: string;

  private storageSubscription: Subscription;
  private logoutSubscription: Subscription;

  public objectIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(localStorageKey: string, aaService: AaService) {
    this.localStorageKey = localStorageKey;

    const obs = fromEvent(window, 'storage').pipe(
      filter((evt: Event) => evt instanceof StorageEvent && evt.key === this.localStorageKey),
      map((evt: Event) => {
        return evt as StorageEvent;
      }),
      map(evt => {
        const cartItems = JSON.parse(evt.newValue || '[]');
        return cartItems;
      })
    )
    this.storageSubscription = obs.subscribe(this.objectIds$);

    this.logoutSubscription = aaService.logout$.pipe(
      filter(val => val===true),
      tap(val => this.removeAll())
    ).subscribe()

    //Set once to trigger initial value
    this.setLocalStorage(this.getLocalStorage());


  }



  destroy() {
    this.storageSubscription.unsubscribe();
    this.logoutSubscription.unsubscribe();
  }



  private setLocalStorage(ids: string[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(ids));
    this.objectIds$.next(ids);
  }


  private getLocalStorage(): string[] {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  }

  addItems(ids: string[]): number {
    const currentIds = this.getLocalStorage()
    const newIds = ids.filter(id => !currentIds.includes(id))
    currentIds.push(...newIds);
    this.setLocalStorage(currentIds);
    return newIds.length;
  }

  removeItems(ids: string[]): number {
    let currentIds: string[] = this.getLocalStorage();
    const prev = currentIds.length;
    if (ids && prev > 0) {
      currentIds = currentIds.filter((element: string) => !ids.includes(element));
      this.setLocalStorage(currentIds);
      return Math.abs(prev - currentIds.length); // removed
    }
    return 0;
  }

  setItems(ids: string[]) {
    this.setLocalStorage(ids);
  }

  removeAll() {
    this.setLocalStorage([]);
  }




}
