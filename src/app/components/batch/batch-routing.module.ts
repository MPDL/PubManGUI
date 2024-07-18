import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
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
    path: 'actions',
    loadComponent: () => import('./actions/actions.component'),
    data: {
      breadcrumb: {
        label: 'Actions',
      }
    },
  },
  {
    path: 'logs',
    data: {
      breadcrumb: {
        label: 'Logs',
      }
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./logs/logs.component'),
        data: {
          breadcrumb: {
            //label: '',
          }
        },
      },
      { 
        path: ':id', 
        loadComponent: () => import('./logs/item/list/log-item-list.component'),
        data: {
          breadcrumb: {
            label: 'Log details',
          }
        }
      }, 
    ],
  },
  {
    path: '',
    loadComponent: () => import('./batch/batch.component')
    /*
    redirectTo: 'datasets',
    pathMatch: 'full',
    */
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule {}
