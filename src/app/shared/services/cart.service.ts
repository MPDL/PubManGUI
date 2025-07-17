import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

const CART_STORAGE_KEY = "cart-items"
@Injectable({
  providedIn: 'root'
})
export class CartService {

  versionIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);


  constructor() {
    this.versionIds$.next(this.objectIds);
  }

  addItems(ids: string[]): number {
    const currentIds = this.objectIds;
    const newIds = ids.filter(id => !currentIds.includes(id))
    currentIds.push(...newIds);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentIds));
    this.versionIds$.next(currentIds);
    return newIds.length;
  }

  removeItems(ids: string[]): number {
    let currentIds: string[] = this.objectIds;
    const prev = this.objectIds.length;
    if (ids && prev > 0) {
      currentIds = currentIds.filter((element: string) => !ids.includes(element));
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentIds));
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


  get objectIds(): string[] {
    if (sessionStorage.getItem(CART_STORAGE_KEY)) {
      const val = JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY)!);
      return  val
    }
    else {
      return [];
    }
  }


}
