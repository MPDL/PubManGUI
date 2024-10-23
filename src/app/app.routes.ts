import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { OuTreeComponent } from './components/ou-tree/ou-tree.component';
import { ItemSearchComponent } from './components/item-search/item-search.component';
import { ItemFormComponent } from './components/item-edit/form/item-form/item-form.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ItemSearchAdvancedComponent } from "./components/item-search-advanced/item-search-advanced.component";
import { itemResolver } from "./services/pubman-rest-client/item-resolver";
import { MyItemsComponent } from "./components/my-items/my-items.component";
import { QaWorkspaceComponent } from "./components/qa-workspace/qa-workspace.component";
import { SearchResultListComponent } from "./components/search-result-list/search-result-list.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      breadcrumb: {
        label: 'Home',
      }
    },
  },
  {
    path: 'list',
    component: ItemListComponent,
    data: {
      breadcrumb: {
        label: 'Datasets',
      }
    },
  },
  {
    path: 'my',
    component: MyItemsComponent,
    data: {
      breadcrumb: {
        label: 'My datasets',
      }
    },
  },
  {
    path: 'qa',
    component: QaWorkspaceComponent,
    data: {
      breadcrumb: {
        label: 'QA Area',
      }
    },
  },
  {
    path: 'search',
    component: SearchResultListComponent,
    data: {
      breadcrumb: {
        label: 'Search',
      }
    },
  },
  {
    path: 'ou_tree',
    component: OuTreeComponent,
    data: {
      breadcrumb: {
        label: 'Organizational units',
      }
    },
  },
  {
    path: 'as', component: ItemSearchComponent, data: {
      saveComponent: true,
      breadcrumb: {
        label: 'Advanced search',
      }
    }
  },
  {
    path: 'as2', component: ItemSearchAdvancedComponent, data: {
      saveComponent: true,
      breadcrumb: {
        label: 'Advanced search',
      }
    }
  },
  {
    path: 'edit/:id', component: ItemFormComponent, resolve: { item: itemResolver }
  },
  {
    path: 'edit', component: ItemFormComponent,
    data: {
      breadcrumb: {
        label: 'Entry',
      }
    },
  },
  {
    path: 'batch',
    loadChildren: () => import('./components/batch/batch-routing.module').then(m => m.BatchRoutingModule),
    data: {
      breadcrumb: {
        label: 'Batch processing',
      }
    },
  },
  {
    path: 'imports',
    loadChildren: () => import('./components/imports/imports-routing.module').then(m => m.ImportsRoutingModule),
    data: {
      breadcrumb: {
        label: 'Imports',
      }
    },
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
