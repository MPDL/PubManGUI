import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchResultListComponent } from './components/list-view/search-result-list/search-result-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'list',
        component: SearchResultListComponent
    },
    /* TODO Add after adding search
    {
        
        path: 'ou_tree',
        component: DynTreeComponent
        
    },
    */
    /* TODO Add after adding search
     {
         path: 'advancedSearch', component: ItemSearchComponent, data: {
             saveComponent: true
         }
     },
     */
    /* TODO Add after adding edit
     {
         path: 'edit/:id', component: ItemFormComponent, resolve: { item: itemResolver }
     },
     */
    /* TODO Add after adding PageNotFoundComponent
     {
         path: '**',
         component: PageNotFoundComponent
     }
     */
];
