import { Component, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";
import { CopyButtonDirective } from "../../../directives/copy-button.directive";

@Component({
  selector: 'pure-feed-modal',
  imports: [
    CopyButtonDirective,
    TranslatePipe,
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
