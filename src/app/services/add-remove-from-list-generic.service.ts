import {BehaviorSubject, fromEvent, Subscription, tap} from "rxjs";
import {AaService} from "./aa.service";
import {filter, map} from "rxjs/operators";
import {Injectable} from "@angular/core";

@Injectable()
export abstract class AddRemoveFromListGenericService {

  private localStorageKey: string;

  private storageSubscription: Subscription | undefined;
  private logoutSubscription: Subscription | undefined;

  public objectIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(localStorageKey: string, aaService: AaService) {
    this.localStorageKey = localStorageKey;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storageEvent$ = fromEvent<StorageEvent>(window, 'storage').pipe(
        filter(evt => evt.key === this.localStorageKey),
        map(evt => JSON.parse(evt.newValue || '[]'))
      );
      this.storageSubscription = storageEvent$.subscribe(this.objectIds$);

      // Set once to trigger initial value (only in browser)
      this.setLocalStorage(this.getLocalStorage());
    }

    this.logoutSubscription = aaService.logout$.pipe(
      filter(val => val === true),
      tap(() => this.removeAll())
    ).subscribe();
  }



  destroy() {
    this.storageSubscription?.unsubscribe();
    this.logoutSubscription?.unsubscribe();
  }



  private setLocalStorage(ids: string[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.localStorageKey, JSON.stringify(ids));
    }
    this.objectIds$.next(ids);
  }

  public removeAll() {
    this.setLocalStorage([]);
  }

  protected getLocalStorage(): string[] {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    }
    return [];
  }

  public addItems(ids: string[]): number {
    const currentIds = this.getLocalStorage()
    const newIds = ids.filter(id => !currentIds.includes(id))
    currentIds.push(...newIds);
    this.setLocalStorage(currentIds);
    return newIds.length;
  }

  public removeItems(ids: string[]): number {
    let currentIds: string[] = this.getLocalStorage();
    const prev = currentIds.length;
    if (ids && prev > 0) {
      currentIds = currentIds.filter((element: string) => !ids.includes(element));
      this.setLocalStorage(currentIds);
      return Math.abs(prev - currentIds.length); // removed
    }
    return 0;
  }

  public setItems(ids: string[]) {
    this.setLocalStorage(ids);
  }




}
