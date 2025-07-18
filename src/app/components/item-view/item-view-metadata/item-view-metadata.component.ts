import { Component, Input } from '@angular/core';
import { IdentifierVO, IdType, ItemVersionVO, PublishingInfoVO } from "../../../model/inge";
import { ItemViewMetadataElementComponent } from "./item-view-metadata-element/item-view-metadata-element.component";
import { ItemViewCreatorsComponent } from "./item-view-creators/item-view-creators.component";
import { EmptyPipe } from "../../../pipes/empty.pipe";
import { SanitizeHtmlPipe } from "../../../pipes/sanitize-html.pipe";
import { isUrl } from "../../../utils/item-utils";
import { environment } from 'src/environments/environment';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-item-view-metadata',
  standalone: true,
  imports: [
    ItemViewMetadataElementComponent,
    ItemViewCreatorsComponent,
    EmptyPipe,
    SanitizeHtmlPipe,
    TranslatePipe
  ],
  templateUrl: './item-view-metadata.component.html',
  styleUrl: './item-view-metadata.component.scss'
})
export class ItemViewMetadataComponent {

  @Input() item!:ItemVersionVO;

  protected coneUri = environment.cone_instance_uri

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

  identifierUrl(id: IdentifierVO) {
    if (IdType.DOI === id.type){
      return 'https://doi.org/' + id.id;
    } else if (IdType.ADS == id.type) {
      return 'https://ui.adsabs.harvard.edu/abs/'+ id.id;
    } else if (IdType.ARXIV == id.type) {
      return 'https://arxiv.org/abs/' + id.id;
    } else if (IdType.CONE == id.type) {
      return this.coneUri + id.id;
    } else if (IdType.ISI == id.type) {
      return 'http://gateway.isiknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcAuth=SFX&SrcApp=SFX&DestLinkType=FullRecord&DestApp=WOS&KeyUT=' + id.id;
    } else if (IdType.PMC == id.type) {
      return 'https://www.ncbi.nlm.nih.gov/pmc/articles/' + id.id;
    } else if (IdType.PMID == id.type) {
      return 'https://pubmed.ncbi.nlm.nih.gov/' + id.id;
    } else if (IdType.SSRN == id.type) {
      return 'https://ssrn.com/abstract=' + id.id;
    } else if (IdType.ZDB == id.type) {
      'https://ld.zdb-services.de/resource/' + id.id;
    } else if (isUrl(id.id)) {
      return id.id;
    }
    return undefined;
  }

}
