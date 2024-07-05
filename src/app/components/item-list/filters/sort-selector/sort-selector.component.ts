import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {FilterEvent} from "../../item-list.component";
import {ItemVersionState} from "../../../../model/inge";
import {baseElasticSearchSortBuilder} from "../../../../shared/services/search-utils";

@Component({
  selector: 'pure-sort-selector',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './sort-selector.component.html',
  styleUrl: './sort-selector.component.scss'
})
export class SortSelectorComponent {

  sortOptionNames = Object.keys(sortOptions);
  @Output() sortChanged = new EventEmitter<any>();

  handleInputChange($event: any){
    const targetVal:string = $event.target.value;
    const sortQuery = baseElasticSearchSortBuilder(sortOptions[targetVal].index[0], sortOptions[targetVal].order);

    this.sortChanged.emit(sortQuery);
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
    order: 'asc',
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
