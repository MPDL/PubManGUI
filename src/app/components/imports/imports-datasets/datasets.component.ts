import {Component, inject} from '@angular/core';
import {Observable, of} from 'rxjs';

import {ActivatedRoute} from '@angular/router';

import {ItemListComponent} from "../../item-list/item-list.component";
import {baseElasticSearchQueryBuilder} from "../../../utils/search-utils";
import {SortSelectorComponent} from "../../item-list/filters/sort-selector/sort-selector.component";

@Component({
  selector: 'pure-import-datasets',
  standalone: true,
  imports: [
    ItemListComponent,
    SortSelectorComponent
],
  templateUrl: './datasets.component.html'
})
export default class DatasetsComponent {
  private route = inject(ActivatedRoute);

  searchQuery: Observable<any> = of({});

  ngOnInit(): void {
    let ids: string[] = [];
    this.route.data.subscribe(value => {
      ids = value['itemList'];
      this.searchQuery = of(baseElasticSearchQueryBuilder({ index: "objectId", type: "keyword" }, ids));
    });
  };
}
