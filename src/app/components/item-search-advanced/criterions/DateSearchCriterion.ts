import { SearchCriterion } from "./SearchCriterion";
import { FormControl, Validators } from "@angular/forms";
import { buildDateRangeQuery } from "../../../utils/search-utils";
import { Observable, of } from "rxjs";
import { DATE_PATTERN } from "../../../services/form-builder.service";

export enum DATE_SEARCH_TYPES {
  ANYDATE = "anyDate",
  PUBLISHED = "publishedDate",
  PUBLISHEDPRINT = "publishedInPrintDate",
  ACCEPTED = "acceptedDate",
  SUBMITTED = "submittedDate",
  MODIFIED = "modifiedDate",
  CREATED = "createdDate",
  EVENT_STARTDATE = "eventStartDate",
  EVENT_ENDDATE = "eventEndDate",
  MODIFIED_INTERNAL = "modifiedInternalDate",
  CREATED_INTERNAL = "createdInternalDate",
  COMPONENT_EMBARGO_DATE = "component_embargo_date",
}

export class DateSearchCriterion extends SearchCriterion {

  constructor(type: string, opts?:any) {
    super(type, opts);
    const validator = Validators.pattern(DATE_PATTERN);
    this.content.addControl("from", new FormControl('', [validator]));
    this.content.addControl("to", new FormControl('', [validator]));
  }

  override getElasticSearchNestedPath(): string | undefined {
    if (this.type == DATE_SEARCH_TYPES.COMPONENT_EMBARGO_DATE) {
      return "files";
    }
    return "";
  }

  override isEmpty(): boolean {
    const from: string = this.content.get('from')?.value;
    const to: string = this.content.get('to')?.value;

    return ((!from) || from.trim()==="") && ((!to) || to.trim()==="");
  }


  override toElasticSearchQuery(): Observable<Object | undefined> {
    return of(this.toElasticSearchQueryInt(this.content.get("from")?.value, this.content.get("to")?.value));
  }


  toElasticSearchQueryInt(from: string, to: string) : Object | undefined{
    switch (this.type) {
      case DATE_SEARCH_TYPES.ANYDATE: {

        return {
          bool: {
            should: [
              buildDateRangeQuery("metadata.datePublishedInPrint", from, to),
              buildDateRangeQuery("metadata.datePublishedOnline", from, to),
              buildDateRangeQuery("metadata.dateAccepted", from, to),
              buildDateRangeQuery("metadata.dateSubmitted", from, to),
              buildDateRangeQuery("metadata.dateModified", from, to),
              buildDateRangeQuery("metadata.dateCreated", from, to),
            ]
          }
        };
      }
      case DATE_SEARCH_TYPES.PUBLISHED:
        return buildDateRangeQuery("metadata.datePublishedOnline", from, to);
      case DATE_SEARCH_TYPES.PUBLISHEDPRINT:
        return buildDateRangeQuery("metadata.datePublishedInPrint", from, to);
      case DATE_SEARCH_TYPES.ACCEPTED:
        return buildDateRangeQuery("metadata.dateAccepted", from, to);
      case DATE_SEARCH_TYPES.SUBMITTED:
        return buildDateRangeQuery("metadata.dateSubmitted", from, to);
      case DATE_SEARCH_TYPES.MODIFIED:
        return buildDateRangeQuery("metadata.dateModified", from, to);
      case DATE_SEARCH_TYPES.CREATED:
        return buildDateRangeQuery("metadata.dateCreated", from, to);
      case DATE_SEARCH_TYPES.EVENT_STARTDATE:
        return buildDateRangeQuery("metadata.event.startDate", from, to);
      case DATE_SEARCH_TYPES.EVENT_ENDDATE:
        return buildDateRangeQuery("metadata.event.endDate", from, to);
      case DATE_SEARCH_TYPES.MODIFIED_INTERNAL:
        return buildDateRangeQuery("modificationDate", from, to);
      case DATE_SEARCH_TYPES.CREATED_INTERNAL:
        return buildDateRangeQuery("creationDate", from, to);
      case DATE_SEARCH_TYPES.COMPONENT_EMBARGO_DATE:
        return buildDateRangeQuery("files.metadata.embargoUntil", from, to);

      default:
        return undefined;
    }
  }



}
