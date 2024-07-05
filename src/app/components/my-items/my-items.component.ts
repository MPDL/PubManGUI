import { Component } from '@angular/core';
import {AaService} from "../../services/aa.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {ItemListComponent} from "../item-list/item-list.component";
import {map, Observable} from "rxjs";

@Component({
  selector: 'pure-my-items',
  standalone: true,
  imports: [
    ItemListComponent
  ],
  templateUrl: './my-items.component.html',
  styleUrl: './my-items.component.scss'
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
