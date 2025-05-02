import {Component, Input} from '@angular/core';
import {DateToYearPipe} from "../../services/pipes/date-to-year.pipe";
import {IdType, ItemVersionVO} from "../../../model/inge";
import {AaService} from "../../../services/aa.service";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'pure-item-badges',
  standalone: true,
  imports: [
    DateToYearPipe,
    TranslatePipe
  ],
  templateUrl: './item-badges.component.html',
  styleUrl: './item-badges.component.scss'
})
export class ItemBadgesComponent {

  @Input() item: ItemVersionVO | undefined;

  @Input() showVersion: boolean = false;

  constructor(protected aaService: AaService) {
  }

  get doi() {
    return this.item?.metadata?.identifiers?.filter(i => i.type === IdType.DOI).map(i => i.id)[0]
  }

  get state() {
    return this.item?.publicState !== 'WITHDRAWN' ? this.item?.versionState : this.item?.publicState
  }

  get publicationState() {
    if (this.item?.metadata.datePublishedInPrint) {
      return "published-in-print"
    } else if (this.item?.metadata.datePublishedOnline) {
      return "published-online"
    } else if (this.item?.metadata.dateAccepted) {
      return "accepted"
    } else if (this.item?.metadata.dateSubmitted) {
      return "submitted"
    } else {
      return undefined;
    }

  }

  get publicationStateDate() {
    if (this.item?.metadata.datePublishedInPrint) {
      return this.item?.metadata.datePublishedInPrint;
    } else if (this.item?.metadata.datePublishedOnline) {
      return this.item?.metadata.datePublishedOnline;
    } else if (this.item?.metadata.dateAccepted) {
      return this.item?.metadata.dateAccepted;
    } else if (this.item?.metadata.dateSubmitted) {
      return this.item?.metadata.dateSubmitted;
    } else {
      return undefined;
    }

  }

}
