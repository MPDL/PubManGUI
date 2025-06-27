import { Component } from '@angular/core';
import {map, Observable} from "rxjs";
import {AaService} from "../../services/aa.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {ItemListComponent} from "../item-list/item-list.component";
import {SortSelectorComponent} from "../item-list/filters/sort-selector/sort-selector.component";
import {ItemFilterComponent} from "../item-list/filters/item-filter/item-filter.component";
import {ItemContextFilterDirective} from "../item-list/filters/directives/item-context-filter.directive";
import {ItemStateFilterDirective} from "../item-list/filters/directives/item-state-filter.directive";
import {ItemVersionState} from "../../model/inge";
import {ItemImportFilterDirective} from "../item-list/filters/directives/item-import-filter.directive";
import {TranslatePipe} from "@ngx-translate/core";


@Component({
  selector: 'pure-qa-workspace',
  standalone: true,
  imports: [
    ItemListComponent,
    SortSelectorComponent,
    ItemFilterComponent,
    //ItemStateFilterDirective,
    ItemContextFilterDirective,
    ItemStateFilterDirective,
    ItemImportFilterDirective,
    TranslatePipe,
  ],
  templateUrl: './qa-workspace.component.html',
  styleUrl: './qa-workspace.component.scss'
})
export class QaWorkspaceComponent {

  searchQuery: Observable<any>;

  constructor(private aaService: AaService) {

    this.searchQuery = aaService.principal.pipe(map(p => {

      if(p.loggedIn) {
        return {
          bool: {
            must: [
              baseElasticSearchQueryBuilder("context.objectId", p.moderatorContexts.map(con => con.objectId)),
              baseElasticSearchQueryBuilder("versionState", [ItemVersionState.SUBMITTED, ItemVersionState.IN_REVISION, ItemVersionState.RELEASED]),
              /*
              {
                script: {
                  script: "doc['latestVersion.versionNumber']==doc['versionNumber']"
                }
              }

               */
            ]
          }
        }

      }
      return undefined;
      })
    )

  }


}
