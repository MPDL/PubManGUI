import { Component, Input } from '@angular/core';
import {
    ItemViewMetadataElementComponent
} from "../../item-view/item-view-metadata/item-view-metadata-element/item-view-metadata-element.component";
import { LoadingComponent } from "../loading/loading.component";
import { Observable } from "rxjs";
import { AffiliationDbVO } from "../../../model/inge";
import { OrganizationsService } from "../../../services/pubman-rest-client/organizations.service";
import { AsyncPipe } from "@angular/common";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-ou-modal',
  imports: [
    ItemViewMetadataElementComponent,
    LoadingComponent
  ],
  templateUrl: './ou-modal.component.html',
  styleUrl: './ou-modal.component.scss'
})
export class OuModalComponent {

  @Input() ouId!: string;
  ou!: AffiliationDbVO;

  constructor(private ouService: OrganizationsService, protected activeModal: NgbActiveModal) {

  }

  ngOnInit() {
    this.ouService.retrieve(this.ouId).subscribe(
      affDbVO => {this.ou=affDbVO;}
    );
}

}
