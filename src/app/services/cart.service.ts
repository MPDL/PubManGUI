import {inject, Injectable, OnDestroy} from '@angular/core';
import {AaService} from "./aa.service";
import {AddRemoveFromListGenericService} from "./add-remove-from-list-generic.service";

const CART_STORAGE_KEY = "cart-items"
@Injectable({
  providedIn: 'root'
})
export class CartService extends AddRemoveFromListGenericService implements OnDestroy {


  constructor(aaService: AaService) {
    super(CART_STORAGE_KEY, aaService)
  }

  ngOnDestroy() {
    super.destroy();
  }




}
