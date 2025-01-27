import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Router } from '@angular/router';

import { ItemListComponent} from "../../item-list/item-list.component";
import { baseElasticSearchQueryBuilder} from "../../../shared/services/search-utils";
import { SortSelectorComponent } from "../../item-list/filters/sort-selector/sort-selector.component";

@Component({
  selector: 'pure-import-datasets',
  standalone: true,
  imports: [
    CommonModule,
    ItemListComponent,
    SortSelectorComponent
],
  templateUrl: './datasets.component.html'
})
export default class DatasetsComponent {

  searchQuery: Observable<any>;

  constructor(
    private router: Router,
  ) {
    const ids = router.getCurrentNavigation()?.extras?.state?.['itemList'] || [];
    this.searchQuery = of(baseElasticSearchQueryBuilder("objectId", ids));
  }

}