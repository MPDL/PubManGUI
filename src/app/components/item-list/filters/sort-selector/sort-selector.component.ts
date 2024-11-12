import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FilterEvent, ItemListComponent} from "../../item-list.component";
import {ItemVersionState} from "../../../../model/inge";
import {baseElasticSearchSortBuilder} from "../../../../shared/services/search-utils";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'pure-sort-selector',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sort-selector.component.html',
  styleUrl: './sort-selector.component.scss'
})
export class SortSelectorComponent {
  @Input() itemList!: ItemListComponent;
  @Input() defaultSort:string = "modificationDate";
  sortOptionNames = Object.keys(sortOptions);
  //@Output() sortChanged = new EventEmitter<any>();
  selectedSort!:string;
  selectedSortOrder!:string;

  constructor(private route: ActivatedRoute, private router: Router) {
   this.selectedSort = this.defaultSort
    this.selectedSortOrder = sortOptions[this.selectedSort].order;
    const sort = route.snapshot.queryParamMap.get('sort');
    if(sort) {
      this.selectedSort=sort
    }
    const sortOrder = route.snapshot.queryParamMap.get('sortOrder');
    if(sortOrder) {
      this.selectedSortOrder = sortOrder
    }
  }

  private updateQueryParams() {
    const queryParams: Params = {
      sort: this.selectedSort,
      sortOrder: this.selectedSortOrder
    };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  ngOnInit(){
    //this.selectedSort = this.defaultSort;
    this.itemList.registerSort(this.getSortQuery(this.selectedSort))
  }

  getCurrentSortQuery(){
    return baseElasticSearchSortBuilder(sortOptions[this.selectedSort].index[0], this.selectedSortOrder);

  }
  handleInputChange($event: any){
    const targetVal:string = $event.target.value;
    this.selectedSort = targetVal;
    this.selectedSortOrder = sortOptions[targetVal].order;
    const sortQuery = this.getCurrentSortQuery()

    console.log(this.selectedSort + ' / '+ this.selectedSortOrder)
    this.itemList.updateSort(sortQuery);
    this.updateQueryParams()
  }

  switchSortOrder() {
    if(this.selectedSortOrder==='asc')
      this.selectedSortOrder = 'desc'
    else
      this.selectedSortOrder = 'asc';
    const sortQuery = this.getCurrentSortQuery()
    console.log(this.selectedSort + ' / '+ this.selectedSortOrder)
    this.itemList.updateSort(sortQuery);
    this.updateQueryParams()
  }

  getSortQuery(sortOption: string)
  {
    return baseElasticSearchSortBuilder(sortOptions[sortOption].index[0], sortOptions[sortOption].order);
  }

}
export interface SortOptionsType {
  [key:string] : {
    index: string[],
    order:string,
    loggedIn: boolean

}
}
export const sortOptions: SortOptionsType = {

  "relevance" : {
    index: ['_score'],
    order: 'desc',
    loggedIn: false
  },

  "modificationDate" : {
    index: ['modificationDate'],
    order: 'desc',
    loggedIn: false
  },
  "creationDate" : {
    index: ['creationDate'],
    order: 'desc',
    loggedIn: false
  },
  "title" : {
    index: ['metadata.title'],
    order: 'asc',
    loggedIn: false
  },
  "genre" : {
    index: ['metadata.genre'],
    order: 'asc',
    loggedIn: false
  },
  "date" : {
    index: ['sort-metadata-dates-by-category'],
    order: 'asc',
    loggedIn: false
  },
  "creators" : {
    index: ['sort-metadata-creators-compound'],
    order: 'asc',
    loggedIn: false
  },
  "publishing-info" : {
    index: ['metadata.publishingInfo.publisher', 'metadata.publishingInfo.place', 'metadata.publishingInfo.edition'],
    order: 'asc',
    loggedIn: false
  },
  "event-title" : {
    index: ['metadata.event.title'],
    order: 'asc',
    loggedIn: false
  },
  "source-title" : {
    index: ['metadata.sources.title'],
    order: 'asc',
    loggedIn: false
  },
  "review-method" : {
    index: ['metadata.reviewMethod'],
    order: 'asc',
    loggedIn: false
  }

}
/*

RELEVANCE("", SearchSortCriteria.SortOrder.DESC, false),

  MODIFICATION_DATE(modificationDatePubItemServiceDbImpl.INDEX_MODIFICATION_DATE, SearchSortCriteria.SortOrder.DESC, false),

  CREATION_DATE(creationDatePubItemServiceDbImpl.INDEX_CREATION_DATE, SearchSortCriteria.SortOrder.ASC, false),

  TITLE(metadata.titlePubItemServiceDbImpl.INDEX_METADATA_TITLE, SearchSortCriteria.SortOrder.ASC, false),

  GENRE(metadata.genrenew String[] {PubItemServiceDbImpl.INDEX_METADATA_GENRE,
  PubItemServiceDbImpl.INDEX_METADATA_DEGREE}, SearchSortCriteria.SortOrder.ASC, false),

DATE(sort-metadata-dates-by-categoryPubItemServiceDbImpl.INDEX_METADATA_DATE_CATEGORY_SORT, SearchSortCriteria.SortOrder.DESC, false), //

  CREATOR(sort-metadata-creators-compoundnew String[] {PubItemServiceDbImpl.INDEX_METADATA_CREATOR_SORT}, SearchSortCriteria.SortOrder.ASC, false),

PUBLISHING_INFO(new String[] {PubItemServiceDbImpl.INDEX_METADATA_PUBLISHINGINFO_PUBLISHER_ID,
  PubItemServiceDbImpl.INDEX_METADATA_PUBLISHINGINFO_PLACE,
  PubItemServiceDbImpl.INDEX_METADATA_PUBLISHINGINFO_EDITION}, SearchSortCriteria.SortOrder.ASC, false), //

EVENT_TITLE(PubItemServiceDbImpl.INDEX_METADATA_EVENT_TITLE, SearchSortCriteria.SortOrder.ASC, false),

  REVIEW_METHOD(PubItemServiceDbImpl.INDEX_METADATA_REVIEW_METHOD, SearchSortCriteria.SortOrder.ASC, false), // ,


  STATE(PubItemServiceDbImpl.INDEX_VERSION_STATE, SearchSortCriteria.SortOrder.ASC, true),

  // OWNER(PubItemServiceDbImpl.INDEX_OWNER_TITLE, SortOrder.ASC),

  COLLECTION(PubItemServiceDbImpl.INDEX_CONTEXT_TITLE, SearchSortCriteria.SortOrder.ASC, true);
*/
