import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HelpComponent } from './pages/help/help.component';
import { DisclaimerComponent } from './pages/disclaimer/disclaimer.component';
import { PrivacyComponent } from './pages/privacy-policy/privacy.component';
import { OuTreeComponent } from './components/ou-tree/ou-tree.component';
import { ItemFormComponent } from './components/item-edit/item-form/item-form.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { ItemSearchAdvancedComponent } from "./components/item-search-advanced/item-search-advanced.component";
import { itemResolver } from "./services/pubman-rest-client/item-resolver";
import { MyItemsComponent } from "./components/my-items/my-items.component";
import { QaWorkspaceComponent } from "./components/qa-workspace/qa-workspace.component";
import { SearchResultListComponent } from "./components/search-result-list/search-result-list.component";
import { fetchItemResolver } from "./components/imports/services/fetch-item-resolver";
import { ItemViewComponent } from "./components/item-view/item-view.component";
import { CartListComponent } from "./components/cart-list/cart-list.component";


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
        labelKey: 'common.searchResult',
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
    path: 'advanced-search', component: ItemSearchAdvancedComponent, data: {
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
    path: 'edit', component: ItemFormComponent, resolve: { templateItem: itemResolver },
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
    path: 'help', component: HelpComponent,
    data: {
      breadcrumb: {
        labelKey: 'common.help',
      }
    }
  },
  {
    path: 'disclaimer', component: DisclaimerComponent,
    data: {
      breadcrumb: {
        labelKey: 'footer.disclaimer',
      }
    }
  },
    {
    path: 'privacy-policy', component: PrivacyComponent,
    data: {
      breadcrumb: {
        labelKey: 'footer.privacy',
      }
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
