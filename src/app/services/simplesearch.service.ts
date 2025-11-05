import { inject, Injectable } from '@angular/core';
import { AaService } from './aa.service';
import { MatomoTracker } from 'ngx-matomo-client';
import { Router } from '@angular/router';
import { SearchStateService } from '../components/search-result-list/search-state.service';
import { baseElasticSearchQueryBuilder } from '../utils/search-utils';
import { ItemVersionState } from '../model/inge';

@Injectable({
  providedIn: 'root'
})
export class SimplesearchService {
  aaService = inject (AaService)
  matomoTracker = inject (MatomoTracker)
  router = inject(Router)
  searchState = inject(SearchStateService)


    public search(searchString:string|undefined|null): void {
      
      if (searchString) {
        const filterOutQuery = this.aaService.filterOutQuery([ItemVersionState.PENDING, ItemVersionState.SUBMITTED, ItemVersionState.IN_REVISION]);
        const query = {
          bool: {
            must: [{ query_string: { query: searchString } }],
            must_not: [
              baseElasticSearchQueryBuilder("publicState", "WITHDRAWN"),
              ...(filterOutQuery ? [filterOutQuery] : [])
            ]
          }
        };
        this.matomoTracker.trackSiteSearch(searchString, "simple");
  
        this.searchState.$currentQuery.next(query);
        //sessionStorage.setItem('currentQuery', JSON.stringify(query));
        this.router.navigateByUrl('/search');
      }
      
    }
}
