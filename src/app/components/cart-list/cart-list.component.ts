import { Component } from '@angular/core';
import { map, Observable } from "rxjs";
import { AaService } from "../../services/aa.service";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { ItemListComponent } from "../item-list/item-list.component";
import { SortSelectorComponent } from "../item-list/filters/sort-selector/sort-selector.component";

@Component({
  selector: 'pure-cart-list',
  standalone: true,
  imports: [
    ItemListComponent,
    SortSelectorComponent
  ],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.scss'
})
export class CartListComponent {

  searchQuery: Observable<any>;

  constructor(private aaService: AaService, private router: Router, private cartService: CartService) {

    //baseElasticSearchQueryBuilder("objectId", cartService.objectIds);

    this.searchQuery = cartService.versionIds$.pipe(
      map(ids => {
      return {terms : {"_id" : ids}}

    }))


  }

}
