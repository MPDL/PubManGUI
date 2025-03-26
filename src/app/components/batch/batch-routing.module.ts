import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { batchLogResolver } from "./services/batch-log.resolver";


const routes: Routes = [
  {
    path: 'datasets',
    loadComponent: () => import('./batch-datasets/datasets.component'),
    data: {
      saveComponent: true,
      breadcrumb: {
        label: $localize`:@@datasets:Datasets`,
      }
    },
  },
  {
    path: 'actions',
    loadComponent: () => import('./features/actions/actions.component'),
    data: {
      breadcrumb: {
        label: $localize`:@@actions:Actions`,
      }
    },
  },
  {
    path: 'logs',
    data: {
      breadcrumb: {
        label: $localize`:@@logs:Logs`,
      }
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/logs/batch-log-list.component'),
        data: {
          breadcrumb: {
            //label: '',
          }
        },
      },
      {
        path: ':logId',
        data: {
          breadcrumb: {
            label: $localize`:@@details:Log details`,
          }
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/logs/batch-action-log/batch-action-details/batch-action-details-list.component'), resolve: { log: batchLogResolver },
            data: {
              breadcrumb: {
                //label: '',
              }
            },
          },
          {
            path: 'view/:id',
            loadComponent: () => import('src/app/components/item-view/item-view.component').then(c => c.ItemViewComponent),
            data: {
              breadcrumb: {
                label: 'View',
              }
            },
          },
        ],
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./batch.component'),
    data: {
      breadcrumb: {
        label: $localize`:@@batch:Batch processing`,
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule { }
