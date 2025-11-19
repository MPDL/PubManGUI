import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {AaService} from "./aa.service";

const CART_STORAGE_KEY = "cart-items"
@Injectable({
  providedIn: 'root'
})
export class CartService {

  versionIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private principalSubscription: Subscription;

 private aaService = inject(AaService);
  constructor() {
    this.versionIds$.next(this.objectIds);

    //Reset cart on login change
    this.principalSubscription = this.aaService.principal.subscribe(principal => {
        this.versionIds$.next([]);
    })

  }

  ngOnDestroy() {
    this.principalSubscription.unsubscribe();
  }

  addItems(ids: string[]): number {
    const currentIds = this.objectIds;
    const newIds = ids.filter(id => !currentIds.includes(id))
    currentIds.push(...newIds);
    //sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentIds));
    this.versionIds$.next(currentIds);
    return newIds.length;
  }

  removeItems(ids: string[]): number {
    let currentIds: string[] = this.objectIds;
    const prev = this.objectIds.length;
    if (ids && prev > 0) {
      currentIds = currentIds.filter((element: string) => !ids.includes(element));
      //sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentIds));
      this.versionIds$.next(currentIds);
      return Math.abs(prev - currentIds.length); // removed
    }
    return 0;

    /*
    const currentIds = this.objectIds;
    const idsToRemove = ids.filter(id => !currentIds.includes(id))
    currentIds.push(...newIds);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentIds));
    return newIds.length;

     */
  }

  removeAll() {
   //sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    this.versionIds$.next([]);
  }


  get objectIds(): string[] {
    return this.versionIds$.value;
    /*
    if (sessionStorage.getItem(CART_STORAGE_KEY)) {
      const val = JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY)!);
      return  val
    }
    else {
      return [];
    }

     */
  }


}
