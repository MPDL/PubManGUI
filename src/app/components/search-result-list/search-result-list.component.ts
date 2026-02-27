import { Component } from '@angular/core';
import { ItemListComponent } from "../item-list/item-list.component";
import { Observable } from "rxjs";
import { AaService } from "../../services/aa.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { SortSelectorComponent } from "../item-list/filters/sort-selector/sort-selector.component";
import { SearchStateService } from "./search-state.service";
import {
  ItemAggregationFilterComponent
} from "../item-list/aggregations/aggregation-filter/item-aggregation-filter.component";
import {
  ItemCreatorAggregationDirective
} from "../item-list/aggregations/aggregation-filter/directives/item-creator-aggregation.directive";
import {
  ItemGenreAggregationDirective
} from "../item-list/aggregations/aggregation-filter/directives/item-genre-aggregation.directive";
import {
  ItemReviewMethodDirective
} from "../item-list/aggregations/aggregation-filter/directives/item-reviewmethod-aggregation.directive";
import {
  ItemSourceTitleAggregationDirective
} from "../item-list/aggregations/aggregation-filter/directives/item-sourcetitle-aggregation.directive";
import { TranslatePipe } from "@ngx-translate/core";
import {SavedSearchService} from "../../services/pubman-rest-client/saved-search.service";
import {ItemSearchAdvancedService} from "../item-search-advanced/item-search-advanced.service";

@Component({
  selector: 'pure-search-result-list',
  standalone: true,
  imports: [
    ItemListComponent,
    SortSelectorComponent,
    ItemAggregationFilterComponent,
    ItemCreatorAggregationDirective,
    ItemGenreAggregationDirective,
    ItemReviewMethodDirective,
    ItemSourceTitleAggregationDirective,
    TranslatePipe
  ],
  templateUrl: './search-result-list.component.html',
  styleUrl: './search-result-list.component.scss'
})
export class SearchResultListComponent {

   //@ViewChild('child') child: ItemListComponent;
  searchQuery!: Observable<any>;

  constructor(private route:ActivatedRoute, protected searchStateService: SearchStateService, private savedSearchService: SavedSearchService, private advancedSearchService: ItemSearchAdvancedService) {
    //Update search query whenever the router sends a new one. As the state in the router is  available in getCurrentNavigation only once during the first constructor call, it has
    //to be drawn from window.history


    this.searchQuery = this.searchStateService.$currentQuery;

    const searchId = this.route.snapshot.queryParamMap.get("searchId");
    if (searchId) {
      this.savedSearchService.retrieve(searchId).subscribe(savedSearch => {
        advancedSearchService.getElasticsearchQueryFromFormJson(savedSearch.searchForm).subscribe(query => {
          this.searchStateService.$currentQuery.next(query);
        });
      })
    }
    else {

    }

    /*
    this.route.queryParamMap.subscribe(params => {
      if(params.get("searchId")) {
        const searchId = params.get("searchId");
        console.log("SearchId: " + searchId);

      }
    })

     */


    /*
    const query = sessionStorage.getItem("currentQuery");
    if(query)
      this.searchQuery = of(JSON.parse(query));
    else
      this.searchQuery = of();

    const q = this.router.getCurrentNavigation()?.extras?.state?.['query'];
    console.log('Router query: ' + q)
    this.searchQuery = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // required to work immediately.
      startWith(this.router),
      map(r => {
        return history.state.query;
      })
    )

     */
  }


}
