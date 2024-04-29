import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'datasets',
    loadComponent: () => import('./datasets/datasets.component')
    .then(m => m.DatasetsComponent),
  },
  {
    path: 'actions',
    loadComponent: () => import('./actions/actions.component')
    .then(m => m.ActionsComponent),
  },
  {
    path: 'logs',
    loadComponent: () => import('./logs/logs.component')
      .then(m => m.LogsComponent),
  },
  {
    path: 'logs/:id', 
    loadComponent: () => import('./logs/item/list/log-item-list.component')
      .then(m => m.LogItemListComponent)
  },
  {
    path: '',
    redirectTo: 'datasets',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule {}
