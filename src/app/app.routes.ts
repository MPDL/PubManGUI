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
        labelKey: 'common.home',
      }
    },
  },
  {
    path: 'my',
    component: MyItemsComponent,
    title: $localize`:@@my:My Datasets`,
    data: {
      saveComponent: true,
      breadcrumb: {
        labelKey: 'common.my',
      }
    },
  },
  {
    path: 'qa',
    component: QaWorkspaceComponent,
    data: {
      saveComponent: true,
      breadcrumb: {
        labelKey: 'common.qa',
      }
    },
  },
  {
    path: 'search',
    component: SearchResultListComponent,
    data: {
      saveComponent: true,
      breadcrumb: {
        labelKey: 'header.search',
      }
    },
  },
  {
    path: 'cart',
    component: CartListComponent,
    data: {
      saveComponent: true,
      breadcrumb: {
        labelKey: 'common.basket',
      }
    },
  },
  {
    path: 'ou_tree',
    component: OuTreeComponent,
    data: {
      breadcrumb: {
        labelKey: 'common.ouTree',
      }
    },
  },

  {
    path: 'as2', component: ItemSearchAdvancedComponent, data: {
      saveComponent: true,
      breadcrumb: {
        labelKey: 'header.advancedSearch',
      }
    }
  },
  {
    path: 'edit/:id', component: ItemFormComponent, resolve: { item: itemResolver },
    data: {
      breadcrumb: {
        labelKey: 'common.edit',
      }
    },
  },
  {
    path: 'view/:id', component: ItemViewComponent,

    data: {
      breadcrumb: {
        labelKey: 'common.view',
      }
    },
  },
  {
    path: 'edit', component: ItemFormComponent,
    data: {
      breadcrumb: {
        labelKey: 'common.edit',
      }
    },
  },
  {
    path: 'edit_import', component: ItemFormComponent, resolve: { item: fetchItemResolver },
    data: {
      breadcrumb: {
        labelKey: 'imports.edit',
      }
    },
  },
  {
    path: 'batch',
    loadChildren: () => import('./components/batch/batch-routing.module').then(m => m.BatchRoutingModule),
    data: {
      breadcrumb: {
        labelKey: 'batch.name',
        active: false
      }
    }
  },
  {
    path: 'imports',
    loadChildren: () => import('./components/imports/imports-routing.module').then(m => m.ImportsRoutingModule),
    data: {
      breadcrumb: {
        labelKey: 'imports.name',
        active: false
      }
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
