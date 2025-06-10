import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {ItemsService} from "../../../services/pubman-rest-client/items.service";
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CdkCopyToClipboard} from "@angular/cdk/clipboard";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'pure-feed-modal',
  imports: [
    CdkCopyToClipboard,
    TranslatePipe,
    NgbTooltip
  ],
  templateUrl: './feed-modal.component.html',
  styleUrl: './feed-modal.component.scss'
})
export class FeedModalComponent {

  @Input() searchQuery: any;

  atomFeedUrl: string = "";

  constructor(protected activeModal: NgbActiveModal) {
  }

  ngOnInit() {
   this.atomFeedUrl = environment.inge_rest_uri + '/feed/search?q=' + encodeURI(JSON.stringify(this.searchQuery));
  }

}
