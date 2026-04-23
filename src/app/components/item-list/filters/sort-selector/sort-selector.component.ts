import { Component, Input, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ItemListComponent } from "../../item-list.component";
import {baseElasticSearchSortBuilder, IndexField} from "../../../../utils/search-utils";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { AddRemoveButtonsComponent } from "src/app/components/shared/add-remove-buttons/add-remove-buttons.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'pure-sort-selector',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    NgbTooltip,
    AddRemoveButtonsComponent
  ],
  templateUrl: './sort-selector.component.html',
  styleUrl: './sort-selector.component.scss'
})
export class SortSelectorComponent implements OnDestroy {
  @Input() itemList!: ItemListComponent;
  @Input() defaultSort:string = "modificationDate";
  @Input() handleQueryParams:boolean = false;

  sortOptionEntries = Object.entries(sortOptions);

  sortEntries: {sort:string, sortOrder:string}[] = [];

  currentSortQuery: any;

  private queryParamsSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    if (this.handleQueryParams) {
      this.queryParamsSubscription = this.route.queryParamMap.subscribe(params => {
        const sortParam = params.get('sort');
        const sortOrderParam = params.get('sortOrder');
        if (sortParam && sortOptions[sortParam]) {
          const sortOrder = (sortOrderParam === 'asc' || sortOrderParam === 'desc')
            ? sortOrderParam
            : sortOptions[sortParam].order;
          this.sortEntries = [{sort: sortParam, sortOrder: sortOrder}];
        } else {
          // Handle missing or invalid sort param the same way
          // We only set to default if we don't have a selection yet
          if (this.sortEntries.length === 0) {
            this.sortEntries = [{sort: this.defaultSort, sortOrder: sortOptions[this.defaultSort].order}];
          }
        }
        this.currentSortQuery = this.getCurrentSortQuery();

        if (this.itemList) {
          this.itemList.updateFilterOrSort();
        }


      });
    } else {
      this.sortEntries = [{sort: this.defaultSort, sortOrder: sortOptions[this.defaultSort].order}];
      this.currentSortQuery = this.getCurrentSortQuery();
    }
  }

  ngOnDestroy() {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  getCurrentSortQuery(){
    return this.sortEntries.map(entry => {
      //console.log("Building query for " + JSON.stringify(entry))
      return baseElasticSearchSortBuilder(sortOptions[entry.sort].index[0], entry.sortOrder, sortOptions[entry.sort].nestedPaths)
    })
    //return baseElasticSearchSortBuilder(sortOptions[this.selectedSort].index[0], this.selectedSortOrder);

  }
  handleInputChange($event: any, index:number){
    const targetVal:string = $event.target.value;

    this.sortEntries[index].sort = targetVal;
    this.sortEntries[index].sortOrder = sortOptions[targetVal].order;
    this.currentSortQuery = this.getCurrentSortQuery();
    this.updateQueryParams();
  }

  switchSortOrder(index: number) {

    if(this.sortEntries[index].sortOrder==='asc')
      this.sortEntries[index].sortOrder = 'desc'
    else
      this.sortEntries[index].sortOrder = 'asc';
    this.currentSortQuery = this.getCurrentSortQuery();
    this.updateQueryParams();
    //this.updateQueryParams()
  }

  addSortCriterion(index:number) {
    const selectedSortEntry = this.sortEntries[index];
    this.sortEntries.push({sort: selectedSortEntry.sort, sortOrder: selectedSortEntry.sortOrder});
    this.currentSortQuery = this.getCurrentSortQuery();
    this.updateQueryParams();
    //this.itemList.updateSort(this.getCurrentSortQuery());
  }

  removeSortCriterion(index:number) {
    this.sortEntries.splice(index,1);
    this.currentSortQuery = this.getCurrentSortQuery();
    this.updateQueryParams();
    //this.itemList.updateSort(this.getCurrentSortQuery());
    }

  updateQueryParams() {
    if (this.handleQueryParams && this.sortEntries.length > 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          sort: this.sortEntries[0].sort,
          sortOrder: this.sortEntries[0].sortOrder
        },
        queryParamsHandling: 'merge',
      });
    } else if (!this.handleQueryParams) {
      if (this.itemList) {
        this.itemList.updateFilterOrSort();
      }
    }
  }


}
export interface SortOptionsType {
  [key:string] : {
    index: IndexField[],
    order:string,
    loggedIn: boolean,
    label: string,
    nestedPaths?: string[]

}
}
export const sortOptions: SortOptionsType = {

  "relevance" : {
    index: [{index:'_score', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'Search.relevance'
  },

  "modificationDate" : {
    index: [{index: 'lastModificationDate', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'Search.dateModifiedInternal'
  },
  "creationDate" : {
    index: [{index: 'creationDate', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'Search.dateCreatedInternal'
  },
  "title" : {
    index: [{index: 'metadata.title.keyword', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.title'
  },
  "genre" : {
    index: [{index: 'metadata.genre', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.genre'
  },
  "date" : {
    index: [{index: 'sort-metadata-dates-by-category', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.date'
  },
  "dateYearOnly" : {
    index: [{index: 'sort-metadata-dates-by-category-year', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.dateYearOnly'
  },
  "datePublishedInPrint" : {
    index: [{index: 'metadata.datePublishedInPrint', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.datePublishedInPrint'
  },
  "dateAccepted" : {
    index: [{index: 'metadata.dateAccepted', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.dateAccepted'
  },
  "datePublishedOnline" : {
    index: [{index: 'metadata.datePublishedOnline', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.datePublishedOnline'
  },
  "creators" : {
    index: [{index: 'sort-metadata-creators-compound', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.creators'
  },
  "creatorsFirst" : {
    index: [{index: 'sort-metadata-creators-first', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.creatorsFirst'
  },
  "publishingInfo" : {
    index: [{index: 'metadata.publishingInfo.publisher', type: 'text'}, {index: 'metadata.publishingInfo.place', type: 'text'}, {index: 'metadata.publishingInfo.edition', type: 'text'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.publishingInfo'
  },
  "eventTitle" : {
    index: [{index: 'metadata.event.title.keyword', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.eventTitle'
  },
  "eventStartDate" : {
    index: [{index: 'metadata.event.startDate', type: 'keyword'}],
    order: 'desc',
    loggedIn: false,
    label: 'MetadataFields.eventStartDate'
  },
  "sourceTitle" : {
    index: [{index: 'metadata.sources.title.keyword', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.sourceTitle',
    nestedPaths: ['metadata.sources']
  },
  "reviewMethod" : {
    index: [{index: 'metadata.reviewMethod', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.reviewMethod'
  },

  "degree" : {
    index: [{index: 'metadata.degree', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.degree'
  },

  "freeKeywords" : {
    index: [{index: 'metadata.freeKeywords.keyword', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.keywords'
  },
  "subjectType" : {
    index: [{index: 'metadata.subjects.type', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.subjectType',
    nestedPaths: ['metadata.subjects']
  },
  "subjectValue" : {
    index: [{index: 'metadata.subjects.value.keyword', type: 'keyword'}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.subjectValue',
    nestedPaths: ['metadata.subjects']
  },
  "localTags" : {
    index: [{index: 'localTags.keyword', type: "keyword"}],
    order: 'asc',
    loggedIn: false,
    label: 'MetadataFields.localTags'
  },


}
