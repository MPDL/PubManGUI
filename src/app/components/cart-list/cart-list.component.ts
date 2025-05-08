import { Component } from '@angular/core';
import {map, Observable, of} from "rxjs";
import {AaService} from "../../services/aa.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {SearchStateService} from "../search-result-list/search-state.service";
import {CartService} from "../../shared/services/cart.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {ItemContextFilterDirective} from "../item-list/filters/directives/item-context-filter.directive";
import {ItemFilterComponent} from "../item-list/filters/item-filter/item-filter.component";
import {ItemImportFilterDirective} from "../item-list/filters/directives/item-import-filter.directive";
import {ItemListComponent} from "../item-list/item-list.component";
import {ItemStateFilterDirective} from "../item-list/filters/directives/item-state-filter.directive";
import {SortSelectorComponent} from "../item-list/filters/sort-selector/sort-selector.component";

@Component({
  selector: 'pure-cart-list',
  standalone: true,
  imports: [
    ItemContextFilterDirective,
    ItemFilterComponent,
    ItemImportFilterDirective,
    ItemListComponent,
    ItemStateFilterDirective,
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
