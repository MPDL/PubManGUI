import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { importLogResolver } from "./services/import-log.resolver";

const routes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./features/new/new.component'),
    data: {
      breadcrumb: {
        label: $localize`:@@new:New`,
      }
    },
  },
  {
    path: 'myimports',
    data: {
      breadcrumb: {
        label: $localize`:@@myimports:My imports`,
      }
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/logs/import-logs-list.component'),
        data: {
          breadcrumb: {
            //label: '',
          }
        },
      },
      {
        path: ':importId',
        data: {
          breadcrumb: {
            label: $localize`:@@imports.list.items:Details`, 
          }
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/logs/import-log/import-details/import-details-list.component'), resolve: { import: importLogResolver },
            data: {
              breadcrumb: {              
                //label: '',
              }
            },
          },
          {
            path: 'log',
            loadComponent: () => import('./features/logs/import-log/import-details/import-detail-log/import-item-details/import-item-details-list.component'), 
            data: {
              breadcrumb: {
                label: 'Log', 
              }
            },
          },
          {
            path: 'datasets',
            loadComponent: () => import('./imports-datasets/datasets.component'),
            data: {
              breadcrumb: {
                label: 'Datasets', 
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
    loadComponent: () => import('./imports.component'),
    data: {
      breadcrumb: {
        label: $localize`:@@imports:Imports`,
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportsRoutingModule {}
