import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./new/new.component'),
    data: {
      breadcrumb: {
        label: 'New', //label: $localize`:@@new:New`,
      }
    },
  },
  {
    path: 'myimports',
    loadComponent: () => import('./list/list.component'),
    data: {
      breadcrumb: {
        label: 'My imports', //label: $localize`:@@myimports:My imports`,
      }
    },
    children: [
      {
        path: 'details:id',
        loadComponent: () => import('./list/details/details.component'),
        data: {
          breadcrumb: {
            label: $localize`:@@details:Import details`,
          }
        },
      },
      { 
        path: 'log:id', 
        loadComponent: () => import('./list/details/log/log.component'),
        data: {
          breadcrumb: {
            label: 'Log', //label: $localize`:@@details:Log details`,
          }
        }
      }, 
    ],
  },
  {
    path: '',
    loadComponent: () => import('./imports.component'),
    data: {
      breadcrumb: {
        label: 'Imports', //label: $localize`:@@imports:Imports`,
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportsRoutingModule {}
