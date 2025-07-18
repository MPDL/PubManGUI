import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ItemListComponent } from "../../item-list.component";
import { baseElasticSearchSortBuilder } from "../../../../utils/search-utils";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-sort-selector',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    NgbTooltip
  ],
  templateUrl: './sort-selector.component.html',
  styleUrl: './sort-selector.component.scss'
})
export class SortSelectorComponent {
  @Input() itemList!: ItemListComponent;
  @Input() defaultSort:string = "modificationDate";

  sortOptionEntries = Object.entries(sortOptions);
  //@Input() defaultSortOrder:string = "desc";
  //sortOptionNames = Object.keys(sortOptions);
  //@Output() sortChanged = new EventEmitter<any>();

  sortEntries: {sort:string, sortOrder:string}[] = [];
  //selectedSort!:string;
  //selectedSortOrder!:string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.sortEntries.push({sort: this.defaultSort, sortOrder: sortOptions[this.defaultSort].order})
    //this.selectedSort = this.defaultSort;
    //this.selectedSortOrder = sortOptions[this.selectedSort].order;
    //this.selectedSort=route.snapshot.queryParamMap.get('sort') || this.defaultSort;
    //this.selectedSortOrder = route.snapshot.queryParamMap.get('sortOrder' )|| sortOptions[this.selectedSort].order;

  }

  ngOnInit(){
    //this.selectedSort = this.defaultSort;
    //console.log(this.getCurrentSortQuery())
    //console.log(this.sortEntries)
    this.itemList.registerSort(this.getCurrentSortQuery())

  }

  ngAfterViewInit() {
    //this.updateQueryParams()
  }

  /*
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

   */



  getCurrentSortQuery(){
    return this.sortEntries.map(entry => {
      //console.log("Building query for " + JSON.stringify(entry))
      return baseElasticSearchSortBuilder(sortOptions[entry.sort].index[0], entry.sortOrder)
    })
    //return baseElasticSearchSortBuilder(sortOptions[this.selectedSort].index[0], this.selectedSortOrder);

  }
  handleInputChange($event: any, index:number){
    const targetVal:string = $event.target.value;

    this.sortEntries[index].sort = targetVal;
    this.sortEntries[index].sortOrder = sortOptions[targetVal].order;
    //this.selectedSort = targetVal;
    //this.selectedSortOrder = sortOptions[targetVal].order;
    const sortQuery = this.getCurrentSortQuery()

    //console.log(this.selectedSort + ' / '+ this.selectedSortOrder)
    this.itemList.updateSort(sortQuery);
    //this.updateQueryParams()
  }

  switchSortOrder(index: number) {

    if(this.sortEntries[index].sortOrder==='asc')
      this.sortEntries[index].sortOrder = 'desc'
    else
      this.sortEntries[index].sortOrder = 'asc';
    const sortQuery = this.getCurrentSortQuery()
    //console.log(this.selectedSort + ' / '+ this.selectedSortOrder)
    this.itemList.updateSort(sortQuery);
    //this.updateQueryParams()
  }

  addSortCriterion(index:number) {
    const selectedSortEntry = this.sortEntries[index];
    this.sortEntries.push({sort: selectedSortEntry.sort, sortOrder: selectedSortEntry.sortOrder});
    this.itemList.updateSort(this.getCurrentSortQuery());
  }

  removeSortCriterion(index:number) {
    this.sortEntries.splice(index,1);
    this.itemList.updateSort(this.getCurrentSortQuery());
    }


}
export interface SortOptionsType {
  [key:string] : {
    index: string[],
    order:string,
    loggedIn: boolean,
    label: string

}
}
export const sortOptions: SortOptionsType = {

  "relevance" : {
    index: ['_score'],
    order: 'desc',
    loggedIn: false,
    label: 'Relevance'
  },

  "modificationDate" : {
    index: ['lastModificationDate'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.dateModified'
  },
  "creationDate" : {
    index: ['creationDate'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.dateCreated'
  },
  "title" : {
    index: ['metadata.title.keyword'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.title'
  },
  "genre" : {
    index: ['metadata.genre'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.genre'
  },
  "date" : {
    index: ['sort-metadata-dates-by-category'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.date'
  },
  "dateYearOnly" : {
    index: ['sort-metadata-dates-by-category-year'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.dateYearOnly'
  },
  "datePublishedInPrint" : {
    index: ['metadata.datePublishedInPrint'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.datePublishedInPrint'
  },
  "dateAccepted" : {
    index: ['metadata.dateAccepted'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.dateAccepted'
  },
  "datePublishedOnline" : {
    index: ['metadata.datePublishedOnline'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.datePublishedOnline'
  },
  "creators" : {
    index: ['sort-metadata-creators-compound'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.creators'
  },
  "creatorsFirst" : {
    index: ['sort-metadata-creators-first'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.creatorsFirst'
  },
  "publishingInfo" : {
    index: ['metadata.publishingInfo.publisher', 'metadata.publishingInfo.place', 'metadata.publishingInfo.edition'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.publishingInfo'
  },
  "eventTitle" : {
    index: ['metadata.event.title.keyword'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.eventTitle'
  },
  "eventStartDate" : {
    index: ['metadata.event.startDate'],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.eventStartDate'
  },
  "sourceTitle" : {
    index: ['metadata.sources.title.keyword'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.sourceTitle'
  },
  "reviewMethod" : {
    index: ['metadata.reviewMethod'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.reviewMethod'
  },

  "degree" : {
    index: ['metadata.degree'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.degree'
  },

  "freeKeywords" : {
    index: ['metadata.freeKeywords.keyword'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.keywords'
  },
  "subjectType" : {
    index: ['metadata.subjects.type'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.subjectType'
  },
  "subjectValue" : {
    index: ['metadata.subjects.value.keyword'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.subjectValue'
  },
  "localTags" : {
    index: ['localTags.keyword'],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.localTags'
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
