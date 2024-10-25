import { Component } from '@angular/core';
import {AaService} from "../../services/aa.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {ItemListComponent} from "../item-list/item-list.component";
import {map, Observable} from "rxjs";
import {SortSelectorComponent} from "../item-list/filters/sort-selector/sort-selector.component";
import {ItemFilterComponent} from "../item-list/filters/item-filter/item-filter.component";
import {ItemStateFilterDirective} from "../item-list/filters/directives/item-state-filter.directive";

@Component({
  selector: 'pure-my-items',
  standalone: true,
  imports: [
    ItemListComponent,
    SortSelectorComponent,
    //ItemStateFilterDirective,
    ItemFilterComponent,
    ItemStateFilterDirective
  ],
  templateUrl: './my-items.component.html',
  styleUrl: './my-items.component.scss',
})
export class MyItemsComponent {

  searchQuery: Observable<any>;

  constructor(private aaService: AaService) {

    this.searchQuery = aaService.principal.pipe(map (p => {
      const userObjectId = p.user?.objectId;
      return {
        bool: {
        must: [
          baseElasticSearchQueryBuilder("creator.objectId", userObjectId ? userObjectId : ""),
          {script : {
              script: "doc['latestVersion.versionNumber']==doc['versionNumber']"
            }
          }
        ]
      }
    }
      })

    )
  }
}
