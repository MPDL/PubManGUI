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
import { fetchItemResolver } from "./components/imports/services/fetch-item-resolver";
import { ItemViewComponent } from "./components/item-view/item-view.component";
import { CartListComponent } from "./components/cart-list/cart-list.component";
import { AuthGuard } from "src/app/services/guards/Auth.guard";

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
    path: 'cart',
    component: CartListComponent,
    data: {
      breadcrumb: {
        label: 'Cart',
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
    path: 'edit/:id', component: ItemFormComponent, resolve: { item: itemResolver },
    data: {
      breadcrumb: {
        label: 'Edit',
      }
    },
  },
  {
    path: 'view/:id', component: ItemViewComponent,

    data: {
      breadcrumb: {
        label: 'View',
      }
    },
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
    path: 'edit_import', component: ItemFormComponent, resolve: { item: fetchItemResolver },
    data: {
      breadcrumb: {
        label: 'Edit import',
      }
    },
  },
  {
    path: 'batch',
    loadChildren: () => import('./components/batch/batch-routing.module').then(m => m.BatchRoutingModule),
    data: {
      breadcrumb: {
        label: 'Batch processing',
        active: false
      }
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'imports',
    loadChildren: () => import('./components/imports/imports-routing.module').then(m => m.ImportsRoutingModule),
    data: {
      breadcrumb: {
        label: 'Imports',
        active: false
      }
    },
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
