import { Component } from '@angular/core';
import {ItemListComponent} from "../item-list/item-list.component";
import {filter, map, Observable, of, pipe, startWith, tap} from "rxjs";
import {AaService} from "../../services/aa.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'pure-search-result-list',
  standalone: true,
    imports: [
        ItemListComponent
    ],
  templateUrl: './search-result-list.component.html',
  styleUrl: './search-result-list.component.scss'
})
export class SearchResultListComponent {

  searchQuery: Observable<any>;

  constructor(private aaService: AaService, private router: Router, private location: Location, private route:ActivatedRoute) {
    //Update search query whenever the router sends a new one. As the state in the router is  available in getCurrentNavigation only once during the first constructor call, it has
    //to be drawn from window.history
    this.searchQuery = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // required to work immediately.
      startWith(this.router),
      map(r => {
        return history.state.query;
      })
    )
  }


}
