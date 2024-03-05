import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { OuTreeComponent } from './components/ou-tree/ou-tree.component';
import { ItemSearchComponent } from './components/item-search/item-search.component';
import { ItemFormComponent } from './components/item-edit/form/item-form/item-form.component';
import { itemResolver } from './services/item-resolver';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import {ItemSearchAdvancedComponent} from "./components/item-search-advanced/item-search-advanced.component";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'start',
        pathMatch: 'full'
      },
      {
        path: 'start',
        component: HomeComponent
      },
      {
        path: 'list',
        component: ItemListComponent
      },
      {
        path: 'ou_tree',
        component: OuTreeComponent
      },
      {
        path: 'as', component: ItemSearchComponent, data: {
          saveComponent: true
        }
      },
      {
        path: 'as2', component: ItemSearchAdvancedComponent, data: {
          saveComponent: true
        }
      },
      {
        path: 'edit/:id', component: ItemFormComponent, resolve: { item: itemResolver }
      },
      {
        path: 'edit', component: ItemFormComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
];
