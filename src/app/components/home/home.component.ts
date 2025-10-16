import { AfterViewInit, Component, OnInit } from "@angular/core";
import { baseElasticSearchQueryBuilder } from "../../utils/search-utils";
import { catchError, map, Observable, of } from "rxjs";
import { ItemVersionVO } from "../../model/inge";
import { ItemsService } from "../../services/pubman-rest-client/items.service";
import { AsyncPipe, DatePipe, SlicePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SanitizeHtmlPipe } from "../../pipes/sanitize-html.pipe";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { LoadingComponent } from "../shared/loading/loading.component";

//My Imports
import { Chart } from 'chart.js/auto';
import { CountUp } from 'countup.js';
import { getThumbnailUrlForFile, getUrlForFile } from "../../utils/item-utils";

@Component({
  selector: 'pure-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    SanitizeHtmlPipe,
    SlicePipe,
    DatePipe,
    LoadingComponent
  ],
})
export class HomeComponent implements OnInit, AfterViewInit {
  latestReleasedItems: Observable<ItemVersionVO[]> = of([]);
  newsItems: Observable<PuReBlogEntry[]> = of([]);
  newsItemError: boolean = false;

  publications: number = 0;   //Soll diese Hardcode immernoch hier bleiben - nach fetch? (Nein)
  targetNumber: number = 500000;

  formattedPublications: string = '';

  documentTypes: { [key: string]: number } = {};

  chart: Chart | undefined;

  constructor(private itemsService: ItemsService, private httpClient: HttpClient) {
    this.fetchLatestReleasedItems();
    this.loadNewsItems();
  }

ngOnInit(): void {
  this.loadGenreAggs(); // new method to fetch real chart data
}


  ngAfterViewInit(): void {
    this.animateCounter();
  }

  animateCounter() {
    const counter = new CountUp('pubCounter', this.targetNumber, {
      duration: 2.5,
      separator: ','
    });

    if (!counter.error) {
      counter.start(() => {
        this.publications = this.targetNumber;
        this.updateFormattedPublications();
      });
    } else {
      console.error('CountUp error:', counter.error);
    }
  }

  updateFormattedPublications() {
    const numberFormat = new Intl.NumberFormat('en-US');
    this.formattedPublications = numberFormat.format(this.publications);
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
        "latestRelease.modificationDate": "desc"
      },
      size: 8
    };

    this.latestReleasedItems = this.itemsService.elasticSearch(query).pipe(
      map(result => result.hits.hits.map((record: any) => record._source as ItemVersionVO)),
    );
  }

  getFirstPublicThumbnailUrl(item: ItemVersionVO) {
    const file = item.files?.find(f => f.visibility === 'PUBLIC' && f.mimeType === 'application/pdf');
    return getThumbnailUrlForFile(file);
  }

  loadNewsItems() {
    this.newsItems = this.httpClient.request<PuReBlogEntry[]>('GET', environment.pure_blog_feed_url).pipe(
      catchError(err => {
        this.newsItemError = true;
        return of([]);
      })
    );
  }

  loadGenreAggs(): void {
  const agg = {
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

  this.itemsService.elasticSearch(agg).subscribe(result => {
    const buckets = result.aggregations['sterms#publications_by_genre'].buckets;
    this.documentTypes = {};

    buckets.forEach((bucket: any) => {
      this.documentTypes[bucket.key] = bucket.doc_count;
    });

    // Now draw the chart with real data
    setTimeout(() => this.createChart(), 0);
  });
}

  createChart(): void {
    const canvas = document.getElementById('documentChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(this.documentTypes);
    const data = Object.values(this.documentTypes);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
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
            //  font: { family: 'Poppins', size: 14 }
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
}

export interface PuReBlogEntry {
  title: string;
  link: string;
  excerpt: string;
  date: Date
}
