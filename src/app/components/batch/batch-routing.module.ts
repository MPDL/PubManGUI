import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'list',
    redirectTo: '/list',
  },
  {
    path: 'actions',
    loadComponent: () => import('./actions/actions.component')
    .then(m => m.ActionsComponent),
  },
  {
    path: 'protocols',
    loadComponent: () => import('./protocols/protocols.component')
      .then(m => m.ProtocolsComponent),
  },
  {
    path: '',
    redirectTo: 'actions',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule {}
