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
            must: [{
              simple_query_string: {
                query: searchString,
                fields: [
                  "metadata.title^5",
                  "metadata.alternativeTitles.value^4",
                  "metadata.creators.person.familyName^5",
                  "metadata.creators.person.givenName^3",
                  "metadata.creators.person.organizations.name^3",
                  "metadata.creators.organization.name^4",
                  "metadata.sources.title^3",
                  "metadata.freeKeywords^3",
                  "metadata.subjects.value^3",
                  "metadata.*^2",
                  "*"
                ]
              }
            }],
            must_not: [
              baseElasticSearchQueryBuilder({index: "publicState", type: "keyword"}, "WITHDRAWN"),
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
