import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./new/new.component'),
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
        loadComponent: () => import('./logs/import-logs.component'),
        data: {
          breadcrumb: {
            //label: '',
          }
        },
      },
      {
        path: ':id',
        data: {
          breadcrumb: {
            label: $localize`:@@imports.list.items:Details`,
          }
        },
        children: [
          {
            path: '',
            loadComponent: () => import('./logs/items/items.component'),
            data: {
              breadcrumb: {              
                //label: '',
              }
            },
          },
          {
            path: 'log',
            loadComponent: () => import('./logs/items/details/details.component'),
            data: {
              breadcrumb: {
                label: 'Log', 
              }
            },
          },
          {
            path: 'datasets',
            loadComponent: () => import('./datasets/datasets.component'),
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
