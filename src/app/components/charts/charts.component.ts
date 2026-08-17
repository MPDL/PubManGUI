import { Component, DestroyRef, ElementRef, EventEmitter, inject, OnDestroy, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';
Chart.register(DoughnutController, ArcElement, Legend, Tooltip);
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { isPlatformBrowser } from '@angular/common';
import { ItemsService } from "../../services/pubman-rest-client/items.service";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pure-charts',
  imports: [TranslatePipe,],
  templateUrl: './charts.component.html',
})
export class ChartsComponent implements OnDestroy {

  @ViewChild('documentChart') private chartCanvas?: ElementRef<HTMLCanvasElement>;
  @Output() totalPublicationsChange = new EventEmitter<number>();

  private readonly agg = {
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
  }
  private chart: Chart | undefined;
  private chartDataReady: boolean = false;
  private documentTypes: { [key: string]: number } = {};
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  

  constructor(private itemsService: ItemsService, private translateService: TranslateService) {
    if (isPlatformBrowser(this.platformId)) {
      this.itemsService.elasticSearch(this.agg, { withCredentials: false }).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(result => {

        let totalPublications = result.hits.total.value;
        this.totalPublicationsChange.emit(totalPublications);  
        const buckets = result.aggregations['sterms#publications_by_genre'].buckets;
        this.documentTypes = {};

        buckets.forEach((bucket: any) => {
          this.documentTypes[bucket.key] = bucket.doc_count;
        });


        this.chartDataReady = true;
        this.tryCreateChart();
      });
    }

  }


  ngOnDestroy(): void {
    this.chart?.destroy();
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


  createChart(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chart?.destroy();

    const labels = Object.keys(this.documentTypes);
    const data = Object.values(this.documentTypes);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.map(label => this.translateService.instant("MdsPublicationGenre." + label).toUpperCase()),
        datasets: [{
          data,
          backgroundColor: ['#00C2FF', '#FAD02E', '#7FFFD4', '#FF6B6B', '#A26EFF', '#1F75FE', '#FFA07A'],
          hoverBackgroundColor: ['#00A0D6', '#E5BA1E ', '#5FEFD0', '#E14C4C', '#8C57E0', '#165EBE', '#FF8C65']
        }]
      },

      options: {
        plugins: {
          legend: {
            labels: {
              color: "#FFF",
            }
          },
          tooltip: {
            // titleColor: 'red',
            callbacks: {
              label: (tooltipItem) => {
                const total = data.reduce((sum, val) => sum + val, 0);
                const value = data[tooltipItem.dataIndex];
                const percent = ((value / total) * 100).toFixed(2);

                return `${percent}%`;
              },
            }
          }
        }
      },


    });
  }

}
