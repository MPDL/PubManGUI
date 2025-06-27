import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SearchStateService } from "src/app/components/search-result-list/search-state.service";
import { baseElasticSearchQueryBuilder } from "../../services/search-utils";

import { TranslatePipe } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap
} from "rxjs";
import { ItemsService } from "src/app/services/pubman-rest-client/items.service";
import sanitizeHtml from "sanitize-html";
import { filter } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';
import {AaService} from "../../../services/aa.service";
import {ItemVersionState} from "../../../model/inge";

@Component({
  selector: 'pure-search',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    NgbTooltip,
  ],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit{

  search_form = this.form_builder.group({
    text: '',
  });

  constructor(
    private form_builder: FormBuilder,
    private router: Router,
    private searchState: SearchStateService,
    private itemsService: ItemsService,
    private aaService: AaService
  ) {
  }

  private document = inject(DOCUMENT);

  mobile: boolean | null = null;
  mobile_options: HTMLElement | null = null;

  ngOnInit(): void {
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1400 ? true : false;
  }


  search(): void {
    const search_term = this.search_form.get('text')?.value;
    if (search_term) {
      const filterOutQuery = AaService.instance.filterOutQuery([ItemVersionState.PENDING, ItemVersionState.SUBMITTED, ItemVersionState.IN_REVISION]);
      const query = {
        bool: {
          must: [{ query_string: { query: search_term } }],
          must_not: [
            baseElasticSearchQueryBuilder("publicState", "WITHDRAWN"),
            ...(filterOutQuery ? [filterOutQuery] : [])
          ]
        }
      };
      this.searchState.$currentQuery.next(query);
      //sessionStorage.setItem('currentQuery', JSON.stringify(query));
      this.router.navigateByUrl('/search');
    }
    this.search_form.controls['text'].patchValue('');
  }


  suggestSearchValues: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      filter(text => text.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      //tap(() => (this.searching = true)),
      switchMap((term) => {
        return this.itemsService.elasticSearch(this.autoSuggestElasticQuery(term)).pipe(
          map(response => {
            let results = response.hits.hits.map((hit: any) => hit.highlight)
              .map((highlight: any) => {
                if (highlight['metadata.title.autosuggest'])
                  return { "type": "title", "value": highlight['metadata.title.autosuggest'][0] };
                else if (highlight['metadata.creators.person.organizations.name.autosuggest'])
                  return { "type": "org", "value": highlight['metadata.creators.person.organizations.name.autosuggest'][0] };
                else if (highlight['metadata.creators.person.completeName.autosuggest'])
                  return { "type": "person", "value": highlight['metadata.creators.person.completeName.autosuggest'][0] };
                return undefined;
              });

            //filter out duplicates
            results = results.filter((result: any, index: number, self: any) => {
              return index === self.findIndex((t: any) => {
                return t.value === result.value && t.type === result.type;
              })
            })

            return results;

          }),
          //tap(() => (this.searchFailed = false)),
          catchError(() => {
            //this.searchFailed = true;
            return of([]);
          }),
        )
      },
      ),
      //tap(() => (this.searching = false)),
    );

  autoSuggestElasticQuery(searchString: string) {
    return {
      "query":
      {
        "multi_match":
        {
          "query": searchString,
          "type": "bool_prefix",
          "operator": "AND",
          "fields":
            [

              "metadata.title.autosuggest",
              "metadata.title.autosuggest._2gram",
              "metadata.title.autosuggest._3gram",

              "metadata.creators.person.completeName.autosuggest",
              "metadata.creators.person.completeName.autosuggest._2gram",
              "metadata.creators.person.completeName.autosuggest._3gram",

              "metadata.creators.person.organizations.name.autosuggest",
              "metadata.creators.person.organizations.name._2gram",
              "metadata.creators.person.organizations.name._3gram"
            ]
        }


      },


      "_source": "false",
      "highlight": {
        "pre_tags": ["<b>"],
        "post_tags": ["</b>"],
        "fields": {
          "metadata.title.autosuggest": {
            "matched_fields": ["metadata.title.autosuggest._index_prefix"]
          },
          "metadata.creators.person.organizations.name.autosuggest": {
            "matched_fields": ["metadata.creators.person.organizations.name.autosuggest._index_prefix"]
          },
          "metadata.creators.person.completeName.autosuggest": {
            "matched_fields": ["metadata.creators.person.completeName.autosuggest._index_prefix"]
          }
        }
      }
    }
  }

  suggestSelected = (event: any) => {
    let searchTerm = event.item.value;

    //strip all html tags
    searchTerm = sanitizeHtml(searchTerm, { allowedTags: [] });

    const query = {
      bool: {
        must: [
          {
            multi_match: {
              query: searchTerm,
              type: "phrase_prefix",
              fields: ["metadata.title", "metadata.creators.person.organizations.name", "metadata.creators.person.completeName"]
            }

          }
        ],
        must_not: [baseElasticSearchQueryBuilder("publicState", "WITHDRAWN")],
        //TODO filter out duplicates
      }
    };
    this.searchState.$currentQuery.next(query);

    this.router.navigateByUrl('/search');
    event.preventDefault();
    this.search_form.controls['text'].patchValue(searchTerm);
  }

  collapse() {
    if (this.mobile) {
      if (!this.mobile_options) this.mobile_options = this.document.getElementById('side_nav_mobile_options');
      if (this.mobile_options?.classList.contains('show')) this.mobile_options!.classList.remove('show');
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1400 ? true : false;
  }


}
