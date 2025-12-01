import { Component, Input } from '@angular/core';
import {
    ItemViewMetadataElementComponent
} from "../../item-view/item-view-metadata/item-view-metadata-element/item-view-metadata-element.component";
import { LoadingComponent } from "../loading/loading.component";
import {forkJoin, Observable, switchMap, tap} from "rxjs";
import { AffiliationDbVO } from "../../../model/inge";
import { OrganizationsService } from "../../../services/pubman-rest-client/organizations.service";
import {AsyncPipe, NgClass} from "@angular/common";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {TranslatePipe} from "@ngx-translate/core";
import {isUrl} from "../../../utils/item-utils";
import {EmptyPipe} from "../../../pipes/empty.pipe";


@Component({
  selector: 'pure-ou-modal',
  imports: [
    ItemViewMetadataElementComponent,
    LoadingComponent,
    TranslatePipe,
    NgClass,
    EmptyPipe
  ],
  templateUrl: './ou-modal.component.html',
  styleUrl: './ou-modal.component.scss'
})
export class OuModalComponent {

  @Input() ouId!: string;
  ou!: AffiliationDbVO;
  parentOUs: AffiliationDbVO[] = []
  successorOUs: AffiliationDbVO[] = []


  constructor(private ouService: OrganizationsService, protected activeModal: NgbActiveModal) {

  }

  ngOnInit() {
    this.loadOus();
  }

  loadOus() {
    this.parentOUs = [];
    this.ouService.getParents(this.ouId).pipe(
      tap(parents => {
        this.ou = parents[0];
        this.parentOUs = parents.reverse();

      })
    ).subscribe();
    this.successorOUs = [];
    this.ouService.getSuccessors(this.ouId).pipe(
      tap(succs => {
        this.successorOUs = succs?.records?.map(rec => rec?.data);

      })
    ).subscribe();
  }

  protected readonly isUrl = isUrl;

  protected changeOu(objectId: string | undefined) {
    if(objectId) {
      this.ouId = objectId;
      this.loadOus();
    }

  }
}

interface SubOu {
  title: string;
  id: string;
}
