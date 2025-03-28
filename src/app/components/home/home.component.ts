import { Component } from "@angular/core";
import {ItemListComponent} from "../item-list/item-list.component";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {catchError, map, Observable, of, tap, throwError} from "rxjs";
import {ItemVersionVO} from "../../model/inge";
import {ItemsService} from "../../services/pubman-rest-client/items.service";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SanitizeHtmlPipe} from "../../shared/services/pipes/sanitize-html.pipe";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'pure-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    ItemListComponent,
    AsyncPipe,
    NgOptimizedImage,
    RouterLink,
    SanitizeHtmlPipe
  ],
})
export class HomeComponent {
  latestReleasedItems: Observable<ItemVersionVO[]> = of([]);


  constructor(private itemsService: ItemsService, private httpClient: HttpClient) {
    // Fetch the latest released items from the backend or any other data source
    // For demonstration, let's assume we have a method to fetch this data
    this.fetchLatestReleasedItems();
    //this.loadNewsItems();
  }

  fetchLatestReleasedItems(): void {
    const query = {
      query: {
        bool: {
          must: [
            {
              "nested": {
                "path": "files",
                "query": {
                  "bool": {
                    "must": [
                      baseElasticSearchQueryBuilder("files.storage", "INTERNAL_MANAGED"),
                      baseElasticSearchQueryBuilder("files.visibility", "PUBLIC"),
                      baseElasticSearchQueryBuilder("files.mimeType", "application/pdf"),
                    ]
                  }
                }
              }
            },
            baseElasticSearchQueryBuilder("versionState", "RELEASED"),
            baseElasticSearchQueryBuilder("publicState", "RELEASED"),
          ]
        }
      },
      sort: {
        "latestRelease.modificationDate": "desc" // Sort by the latest upload date
      },
      size: 8 // Fetch the top 10 latest released items
    };

    this.latestReleasedItems = this.itemsService.elasticSearch(query).pipe(
      map(result => result.hits.hits.map((record:any) => record._source as ItemVersionVO)),
    );
    }

    getFirstPublicThumbnail(item: ItemVersionVO) {
      return item.files?.find(f => f.visibility === 'PUBLIC' && f.mimeType === 'application/pdf')
    }


    loadNewsItems() {
      return this.httpClient.request('GET', 'https://blog.pure.mpdl.mpg.de/feed', {

      }).pipe(
        //map((response: any) => response),
        catchError((error) => {
          return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
        })
      ).subscribe();
    }

}
