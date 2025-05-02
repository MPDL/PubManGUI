import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { importLogResolver } from "./services/import-log.resolver";

const routes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./features/new/new.component'),
    data: {
      breadcrumb: {
        labelKey: 'common.new',
      }
    },
  },
  {
    path: 'myimports',
    data: {
      breadcrumb: {
        labelKey: 'common.myimports',
      }
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/logs/import-logs-list.component'),
        data: {
          breadcrumb: {
            //labelKey: '',
          }
        },
      },
      {
        path: ':importId',
        data: {
          breadcrumb: {
            labelKey: 'imports.list.items',
          }
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/logs/import-log/import-details/import-details-list.component'), resolve: { import: importLogResolver },
            data: {
              breadcrumb: {
                //labelKey: '',
              }
            },
          },
          {
            path: 'log',
            loadComponent: () => import('./features/logs/import-log/import-details/import-detail-log/import-item-details/import-item-details-list.component'),
            data: {
              breadcrumb: {
                labelKey: 'imports.list.details',
              }
            },
          },
          {
            path: 'datasets',
            loadComponent: () => import('./imports-datasets/datasets.component'),
            data: {
              breadcrumb: {
                labelKey: 'common.datasets',
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
    loadComponent: () => import('./imports.component'),
    data: {
      breadcrumb: {
        labelKey: 'imports.name',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportsRoutingModule { }
