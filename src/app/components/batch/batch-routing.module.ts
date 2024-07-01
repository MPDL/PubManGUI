import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'datasets',
    loadComponent: () => import('./datasets/datasets.component')
  },
  {
    path: 'actions',
    loadComponent: () => import('./actions/actions.component')
  },
  {
    path: 'logs',
    loadComponent: () => import('./logs/logs.component')
  },
  {
    path: 'logs/:id', 
    loadComponent: () => import('./logs/item/list/log-item-list.component')
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
