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
        labelKey: 'common.datasets',
      }
    },
  },
  {
    path: 'actions',
    loadComponent: () => import('./features/actions/actions.component'),
    data: {
      breadcrumb: {
        labelKey: 'common.actions',
      }
    },
  },
  {
    path: 'logs',
    data: {
      breadcrumb: {
        labelKey: 'common.logs',
      }
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/logs/batch-log-list.component'),
        data: {
          breadcrumb: {
            //labelKey: '',
          }
        },
      },
      {
        path: ':logId',
        data: {
          breadcrumb: {
            labelKey: 'batch.logs.details',
          }
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/logs/batch-action-log/batch-action-details/batch-action-details-list.component'), resolve: { log: batchLogResolver },
            data: {
              breadcrumb: {
                //labelKey: '',
              }
            },
          },
          {
            path: 'view/:id',
            loadComponent: () => import('src/app/components/item-view/item-view.component').then(c => c.ItemViewComponent),
            data: {
              breadcrumb: {
                labelKey: 'common.view',
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
        labelKey: 'batch.name',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule { }
