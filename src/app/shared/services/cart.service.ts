import { Injectable } from '@angular/core';

const CART_STORAGE_KEY = "cart-items"
@Injectable({
  providedIn: 'root'
})
export class CartService {


  addItems(ids: string[]): number {
    const currentIds = this.objectIds;
    const newIds = ids.filter(id => !currentIds.includes(id))
    currentIds.push(...newIds);
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentIds));
    return newIds.length;
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
