import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { baseElasticSearchQueryBuilder } from "../../utils/search-utils";
import { catchError, map, Observable, of } from "rxjs";
import { ItemVersionVO } from "../../model/inge";
import { ItemsService } from "../../services/pubman-rest-client/items.service";
import { AsyncPipe, DatePipe, DecimalPipe, SlicePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SanitizeHtmlPipe } from "../../pipes/sanitize-html.pipe";
import {HttpClient, HttpContext} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { LoadingComponent } from "../shared/loading/loading.component";

//My Imports

import { getThumbnailUrlForFile } from "../../utils/item-utils";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SimplesearchService } from "src/app/services/simplesearch.service";
import {DISPLAY_ERROR} from "src/app/services/interceptors/http-context-tokens";
import { ChartsComponent } from "../charts/charts.component";

@Component({
  selector: 'pure-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouterLink,
    SanitizeHtmlPipe,
    SlicePipe,
    DatePipe,
    LoadingComponent,
    TranslatePipe,
    FormsModule,
    ChartsComponent
],
})
export class HomeComponent implements OnInit {
  

  latestReleasedItems: Observable<ItemVersionVO[]> = of([]);
  newsItems: Observable<PuReBlogEntry[]> = of([]);
  newsItemError: boolean = false;

  formattedPublications: string = '';

  documentTypes: { [key: string]: number } = {};
  
  private chartDataReady = false;

  searchTerm:string = "";
  totalPublications: any;

  constructor(private itemsService: ItemsService, private httpClient: HttpClient, private translateService:TranslateService, private simpleSearch: SimplesearchService) {
    this.fetchLatestReleasedItems();
    this.loadNewsItems();
  }

  ngOnInit(): void {
    // Chart data is only used browser-side — skip the ES aggregation call on the server.
    
  }

  onSearch(): void{
    this.simpleSearch.search(this.searchTerm);
    this.searchTerm = ''; // optional: clear the input afterward
  }

  fetchLatestReleasedItems(): void {
    const query = {
      query: {
        bool: {
          must: [
            {
              nested: {
                path: "files",
                query: {
                  bool: {
                    must: [
                      baseElasticSearchQueryBuilder({index: "files.storage", type: "keyword"}, "INTERNAL_MANAGED"),
                      baseElasticSearchQueryBuilder({index: "files.visibility", type: "keyword"}, "PUBLIC"),
                      baseElasticSearchQueryBuilder({index: "files.mimeType.keyword", type: "keyword"}, "application/pdf"),
                    ]
                  }
                }
              }
            },
            baseElasticSearchQueryBuilder({index: "versionState", type: "keyword"}, "RELEASED"),
            baseElasticSearchQueryBuilder({index: "publicState", type: "keyword"}, "RELEASED"),
          ]
        }
      },
      sort: {
        "latestRelease.modificationDate": "desc"
      },
      size: 8
    };

    this.latestReleasedItems = this.itemsService.elasticSearch(query, {withCredentials: false}).pipe(
      map(result => result.hits.hits.map((record: any) => record._source as ItemVersionVO)),
    );
  }

  getFirstPublicThumbnailUrl(item: ItemVersionVO) {
    const file = item.files?.find(f => f.visibility === 'PUBLIC' && f.mimeType === 'application/pdf');
    return getThumbnailUrlForFile(file);
  }

  loadNewsItems() {
    const context:HttpContext = new HttpContext().set(DISPLAY_ERROR, false);
    this.newsItems = this.httpClient.request<PuReBlogEntry[]>('GET', environment.pure_blog_feed_url, {context: context}).pipe(
      catchError(err => {
        this.newsItemError = true;
        return of([]);
      })
    );
  }

}

export interface PuReBlogEntry {
  title: string;
  link: string;
  excerpt: string;
  date: Date
}
