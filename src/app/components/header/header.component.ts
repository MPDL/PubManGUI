import {Component, ElementRef, Input, Renderer2, inject, HostListener} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AaComponent} from '../aa/aa.component';
import {SwitchBsThemeComponent} from 'src/app/shared/components/switch-bs-theme/switch-bs-theme.component';
import {TooltipDirective} from 'src/app/shared/directives/tooltip.directive';
import {DOCUMENT, NgClass} from '@angular/common';
import {AaService} from 'src/app/services/aa.service';
import {LangSwitchComponent} from 'src/app/shared/components/lang-switch/lang-switch.component';
import {SidenavComponent} from 'src/app/shared/components/sidenav/sidenav.component';
import {SearchStateService} from "../search-result-list/search-state.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";

import {TranslatePipe} from "@ngx-translate/core";
import {NgbTooltip, NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
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
import {ItemsService} from "../../services/pubman-rest-client/items.service";
import {SanitizeHtmlCitationPipe} from "../../shared/services/pipes/sanitize-html-citation.pipe";
import sanitizeHtml from "sanitize-html";
import {filter} from "rxjs/operators";


@Component({
  selector: 'pure-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TooltipDirective,
    SwitchBsThemeComponent,
    LangSwitchComponent,
    AaComponent,
    SidenavComponent,
    NgClass,
    TranslatePipe,
    NgbTooltip,
    NgbTypeahead,
    SanitizeHtmlCitationPipe
  ]
})
export class HeaderComponent {

  headerHeight: number = 0;
  header!: HTMLElement;
  private document = inject(DOCUMENT);
  isScrolled = false;

  ngOnInit() {
    const nav = this.document.getElementById('header');
    if (nav) {
      this.header = nav;
    }
    this.headerHeight = this.header.offsetHeight as number;
  }

  search_form = this.form_builder.group({
    text: '',
  });

  constructor(
    private form_builder: FormBuilder,
    public aa: AaService,
    private router: Router,
    private searchState: SearchStateService,
    private itemsService: ItemsService
  ) {
  }

  search(): void {
    const search_term = this.search_form.get('text')?.value;
    if (search_term) {
      const query = {
        bool: {
          must: [{query_string: {query: search_term}}],
          must_not: [baseElasticSearchQueryBuilder("publicState", "WITHDRAWN")],
          //TODO filter out duplicates
        }
      };
      this.searchState.$currentQuery.next(query);
      //sessionStorage.setItem('currentQuery', JSON.stringify(query));
      this.router.navigateByUrl('/search');
    }
    this.search_form.controls['text'].patchValue('');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }

  tools() {
    alert('select from tools ...');
  }

  switch_lang() {
    const loc = localStorage.getItem('locale');
    if (loc?.localeCompare('de') === 0) {
      localStorage.setItem('locale', 'en');
    } else {
      localStorage.setItem('locale', 'de');
    }
    location.reload();
  }


  suggestSearchValues: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      filter(text => text.length>2),
      debounceTime(200),
      distinctUntilChanged(),
      //tap(() => (this.searching = true)),
      switchMap((term) => {
        return this.itemsService.elasticSearch(this.autoSuggestElasticQuery(term)).pipe(
          map(response => {
              let results = response.hits.hits.map((hit: any) => hit.highlight)
                .map((highlight: any) => {
                if (highlight['metadata.title.autosuggest'])
                  return { "type": "title", "value" : highlight['metadata.title.autosuggest'][0]};
                else if (highlight['metadata.creators.person.organizations.name.autosuggest'])
                  return { "type": "org", "value" : highlight['metadata.creators.person.organizations.name.autosuggest'][0]};
                else if (highlight['metadata.creators.person.completeName.autosuggest'])
                  return { "type": "person", "value" : highlight['metadata.creators.person.completeName.autosuggest'][0]};
                return undefined;
              });

              //filter out duplicates
              results = results.filter((result:any, index:number, self:any) => {
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
        )},
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

  suggestSelected= (event: any) => {
    let searchTerm = event.item.value;

    //strip all html tags
    searchTerm = sanitizeHtml(searchTerm, {allowedTags: []});

    const query = {
      bool: {
        must: [
          {
            multi_match: {
              query: searchTerm,
              type:"phrase_prefix",
              fields: ["metadata.title","metadata.creators.person.organizations.name", "metadata.creators.person.completeName"]
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

}
