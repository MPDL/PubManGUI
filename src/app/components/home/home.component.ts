import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { baseElasticSearchQueryBuilder } from "../../utils/search-utils";
import { catchError, map, Observable, of } from "rxjs";
import { ItemVersionVO } from "../../model/inge";
import { ItemsService } from "../../services/pubman-rest-client/items.service";
import { AsyncPipe, DatePipe, DecimalPipe, isPlatformBrowser, SlicePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SanitizeHtmlPipe } from "../../pipes/sanitize-html.pipe";
import {HttpClient, HttpContext} from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { LoadingComponent } from "../shared/loading/loading.component";

//My Imports
import { Chart } from 'chart.js/auto';
import { getThumbnailUrlForFile } from "../../utils/item-utils";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { SimplesearchService } from "src/app/services/simplesearch.service";
import {DISPLAY_ERROR} from "src/app/services/interceptors/http-context-tokens";

@Component({
  selector: 'pure-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouterLink,
    SanitizeHtmlPipe,
    SlicePipe,
    DatePipe,
    LoadingComponent,
    TranslatePipe,
    FormsModule
  ],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('documentChart') private chartCanvas?: ElementRef<HTMLCanvasElement>;

  latestReleasedItems: Observable<ItemVersionVO[]> = of([]);
  newsItems: Observable<PuReBlogEntry[]> = of([]);
  newsItemError: boolean = false;

  formattedPublications: string = '';

  documentTypes: { [key: string]: number } = {};
  totalPublications:number =0;
  chart: Chart | undefined;
  private chartDataReady = false;
  private readonly platformId = inject(PLATFORM_ID);

  searchTerm:string = "";

  constructor(private itemsService: ItemsService, private httpClient: HttpClient, private translateService:TranslateService, private simpleSearch: SimplesearchService) {
    this.fetchLatestReleasedItems();
    this.loadNewsItems();
  }

  ngOnInit(): void {
  this.loadGenreAggs(); // new method to fetch real chart data
  }

  ngAfterViewInit(): void {
    this.tryCreateChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
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

  loadGenreAggs(): void {
  const agg = {
    //includes total count in the response
    track_total_hits: true,

    aggs: {
      publications_by_genre: {
        terms: {
          field: "metadata.genre",
          size: 7
        }
      }
    },
    size: 0
  };

  this.itemsService.elasticSearch(agg,{withCredentials: false}).subscribe(result => {

    this.totalPublications = result.hits.total.value;
    const buckets = result.aggregations['sterms#publications_by_genre'].buckets;
    this.documentTypes = {};

    buckets.forEach((bucket: any) => {
      this.documentTypes[bucket.key] = bucket.doc_count;
    });


    this.chartDataReady = true;
    this.tryCreateChart();
  });
  }

  private tryCreateChart(): void {
    if (!this.chartDataReady || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.createChart(canvas);
  }


  createChart(canvas: HTMLCanvasElement): void{
  const ctx = canvas.getContext('2d');
  if (!ctx){
    return;
  }

  this.chart?.destroy();

  const labels = Object.keys(this.documentTypes);
  const data= Object.values(this.documentTypes);

  this.chart= new Chart(ctx, {
    type: 'doughnut',
    data:{ labels: labels.map(label => this.translateService.instant("MdsPublicationGenre." + label).toUpperCase()) ,
        datasets:[{data,
        backgroundColor: ['#00C2FF', '#FAD02E', '#7FFFD4', '#FF6B6B', '#A26EFF', '#1F75FE', '#FFA07A'],
        hoverBackgroundColor: ['#00A0D6', '#E5BA1E ', '#5FEFD0', '#E14C4C', '#8C57E0', '#165EBE', '#FF8C65']
      }]
    },

    options:{
      plugins:{
        legend:{
          labels:{
            color: "#FFF",
          }
        },
        tooltip:{
             // titleColor: 'red',
          callbacks:{
            label:(tooltipItem) =>{
              const total = data.reduce((sum, val) => sum +val, 0);
              const value = data[tooltipItem.dataIndex];
              const percent = ((value / total) *100).toFixed(2);

              return `${percent}%`;
            },
          }
        }
      }
    },


  });
  }

 /* createChart(): void {
    const canvas = document.getElementById('documentChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(this.documentTypes);
    const data = Object.values(this.documentTypes);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{
          data,
            backgroundColor: ['#00C2FF', '#FAD02E', '#7FFFD4', '#FF6B6B', '#A26EFF', '#1F75FE', '#FFA07A'],
            hoverBackgroundColor: ['#00A0D6', '#E5BA1E ', '#5FEFD0', '#E14C4C', '#8C57E0', '#165EBE', '#FF8C65']
        }]
      },
      options: {
        //responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#FFF',
            }
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const total = data.reduce((sum, val) => sum + val, 0);
                const val = data[tooltipItem.dataIndex];
                return `${labels[tooltipItem.dataIndex]}: ${(val / total * 100).toFixed(2)}%`;
              }
            }
          }
        }
      }
    });
  }
*/

}

export interface PuReBlogEntry {
  title: string;
  link: string;
  excerpt: string;
  date: Date
}
