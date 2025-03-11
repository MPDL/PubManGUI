import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { batchLogResolver } from "./services/batch-log.resolver";


const routes: Routes = [
  {
    path: 'datasets',
    loadComponent: () => import('./datasets/datasets.component'),
    data: {
      breadcrumb: {
        label: $localize`:@@datasets:Datasets`,
      }
    },
  },
  {
    path: 'actions',
    loadComponent: () => import('./actions/actions.component'),
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
        loadComponent: () => import('./logs/batch-logs.component'),
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
            loadComponent: () => import('./logs/items/items.component'), resolve: { log: batchLogResolver },
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
