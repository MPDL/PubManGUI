import {Component, Input} from '@angular/core';
import {AffiliationDbVO, CreatorVO, ItemVersionVO, OrganizationVO, PublishingInfoVO} from "../../../model/inge";
import {ItemViewMetadataElementComponent} from "./item-view-metadata-element/item-view-metadata-element.component";
import {BehaviorSubject} from "rxjs";
import {ItemViewCreatorsComponent} from "./item-view-creators/item-view-creators.component";
import {AsyncPipe} from "@angular/common";
import {EmptyPipe} from "../../../shared/services/pipes/empty.pipe";
import {SanitizeHtmlPipe} from "../../../shared/services/pipes/sanitize-html.pipe";

@Component({
  selector: 'pure-item-view-metadata',
  standalone: true,
  imports: [
    ItemViewMetadataElementComponent,
    ItemViewCreatorsComponent,
    AsyncPipe,
    EmptyPipe,
    SanitizeHtmlPipe
  ],
  templateUrl: './item-view-metadata.component.html',
  styleUrl: './item-view-metadata.component.scss'
})
export class ItemViewMetadataComponent {

  @Input() item!:ItemVersionVO;

  affiliations: OrganizationVO[] = [];
  affiliationMap: Map<string, OrganizationVO> = new Map();
  creatorMap: Map<CreatorVO, number[]> = new Map();

  constructor() {
  }


  publishingInfoString(pubInfo: PublishingInfoVO) {
    let pubInfoString = '';
    if (pubInfo) {
      //place
      if (pubInfo.place) {
        pubInfoString = pubInfoString.concat(pubInfo.place.trim());
      }
      //colon
      if (pubInfo.publisher && pubInfo.place) {
        pubInfoString = pubInfoString.concat(' : ')
      }

      //publisher
      if (pubInfo.publisher) {
        pubInfoString = pubInfoString.concat(pubInfo.publisher)
      }

      //comma
      if (pubInfo.edition && (pubInfo.publisher || pubInfo.place)) {
        pubInfoString = pubInfoString.concat(', ')
      }

      if (pubInfo.edition) {
        pubInfoString = pubInfoString.concat(pubInfo.edition)
      }
    }
    return pubInfoString;
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

}
