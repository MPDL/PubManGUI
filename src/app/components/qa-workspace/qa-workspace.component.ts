import { Component } from '@angular/core';
import {map, Observable} from "rxjs";
import {AaService} from "../../services/aa.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {ItemListComponent} from "../item-list/item-list.component";
import {SortSelectorComponent} from "../item-list/filters/sort-selector/sort-selector.component";
import {ItemFilterComponent} from "../item-list/filters/item-filter/item-filter.component";
import {ItemContextFilterDirective} from "../item-list/filters/directives/item-context-filter.directive";
import {ItemStateFilterDirective} from "../item-list/filters/directives/item-state-filter.directive";


@Component({
  selector: 'pure-qa-workspace',
  standalone: true,
  imports: [
    ItemListComponent,
    SortSelectorComponent,
    ItemFilterComponent,
    //ItemStateFilterDirective,
    ItemContextFilterDirective,
    ItemStateFilterDirective
  ],
  templateUrl: './qa-workspace.component.html',
  styleUrl: './qa-workspace.component.scss'
})
export class QaWorkspaceComponent {

  searchQuery: Observable<any>;

  constructor(private aaService: AaService) {

    this.searchQuery = aaService.principal.pipe(map(p => {

        return {
          bool: {
            must: [baseElasticSearchQueryBuilder("context.objectId", p.moderatorContexts.map(con => con.objectId))]
          }
        }


      })
    )

  }
}
