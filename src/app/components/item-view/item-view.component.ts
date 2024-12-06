import {Component, HostListener, Input, TemplateRef} from '@angular/core';
import {ItemsService} from "../../services/pubman-rest-client/items.service";
import {AaService} from "../../services/aa.service";
import {ItemVersionVO} from "../../model/inge";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {TopnavComponent} from "../../shared/components/topnav/topnav.component";
import {AsyncPipe, NgClass, ViewportScroller} from "@angular/common";
import {DateToYearPipe} from "../../shared/services/pipes/date-to-year.pipe";
import {ItemBadgesComponent} from "../../shared/components/item-badges/item-badges.component";
import {NgbModal, NgbPopover, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {ItemViewMetadataComponent} from "./item-view-metadata/item-view-metadata.component";
import {BehaviorSubject, delay, map, Observable, pipe, tap, timeout} from "rxjs";
import * as props from "../../../assets/properties.json";
import {
  ItemViewMetadataElementComponent
} from "./item-view-metadata/item-view-metadata-element/item-view-metadata-element.component";
import {SanitizeHtmlPipe} from "../../shared/services/pipes/sanitize-html.pipe";
import {ItemViewFileComponent} from "./item-view-file/item-view-file.component";
import {EmptyPipe} from "../../shared/services/pipes/empty.pipe";
import {MessageService} from "../../shared/services/message.service";
import {ExportItemsComponent} from "../../shared/components/export-items/export-items.component";
import {PaginatorComponent} from "../../shared/components/paginator/paginator.component";
import {TopnavBatchComponent} from "../../shared/components/topnav/topnav-batch/topnav-batch.component";
import {TopnavCartComponent} from "../../shared/components/topnav/topnav-cart/topnav-cart.component";

@Component({
  selector: 'pure-item-view',
  standalone: true,
  imports: [
    TopnavComponent,
    ItemBadgesComponent,
    RouterLink,
    ItemViewMetadataComponent,
    ItemViewMetadataElementComponent,
    AsyncPipe,
    SanitizeHtmlPipe,
    ItemViewFileComponent,
    EmptyPipe,
    ExportItemsComponent
  ],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.scss'
})
export class ItemViewComponent {
  protected ingeUri = props.inge_uri;
  currentSubMenuSelection = "abstract";

  versions$!: Observable<any>;
  item$!: Observable<ItemVersionVO>;

  item!: ItemVersionVO;

  authorizationInfo: any;

  latestVersionAuthorizationInfo: any;

  citation: string | undefined

  constructor(private itemsService: ItemsService, protected aaService: AaService, private route: ActivatedRoute, private router: Router,
  private scroller: ViewportScroller, private messageService: MessageService, private modalService: NgbModal) {

  }



  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if(id)
      this.init(id);

      /*
    this.item$.pipe(
      tap(i => {
        if (i && i.objectId) {
          this.item = i;
          this.versions$ = this.itemsService.retrieveHistory(i.objectId, this.aaService.token);
          this.itemsService.retrieveAuthorizationInfo(i.objectId, this.aaService.token).pipe(
            tap(authInfo => {
                this.authorizationInfo = authInfo;
                if(i.latestVersion?.versionNumber===i.versionNumber) {
                  this.latestVersionAuthorizationInfo = this.authorizationInfo;
                }
                else {
                  if (i && i.objectId) {
                    this.itemsService.retrieveAuthorizationInfo(i.objectId, this.aaService.token).subscribe(authInfoLv => {
                      this.latestVersionAuthorizationInfo = authInfoLv
                    })
                  }
                }
              }
            )
          ).subscribe()
        }

      },

    )).subscribe()
*/

    const subMenu = sessionStorage.getItem('selectedSubMenuItemView');
    if(subMenu) {
      this.currentSubMenuSelection = subMenu;
    }
  }

  init(id:string) {

    if (id)
      this.item$ = this.itemsService.retrieve(id, this.aaService.token);
    this.item$.subscribe(i => {
      if (i && i.objectId) {
        this.item = i;
        this.versions$ = this.itemsService.retrieveHistory(i.objectId, this.aaService.token);

        this.itemsService.retrieveAuthorizationInfo(i.objectId + '_' + i.versionNumber, this.aaService.token).subscribe(authInfo => {
          this.authorizationInfo = authInfo;
          if(i.latestVersion?.versionNumber===i.versionNumber) {
            this.latestVersionAuthorizationInfo = this.authorizationInfo;
          }
          else {
            if (i && i.objectId) {
              this.itemsService.retrieveAuthorizationInfo(i.objectId + '_' + i.latestVersion?.versionNumber, this.aaService.token).subscribe(authInfoLv => {
                this.latestVersionAuthorizationInfo = authInfoLv
              })
            }
          }
        })

        this.itemsService.retrieveSingleCitation(i.objectId + '_' + i.versionNumber, undefined,undefined,this.aaService.token).subscribe(citation => {
          this.citation = citation;
        })
      }
    })
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      /*.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );

       */
  }

  get firstAuthors() {
    return this.item.metadata.creators.slice(0,10);
  }

  get storedFiles() {
   return this.item?.files?.filter(f => f.storage === 'INTERNAL_MANAGED');
  }

  get externalReferences() {
    return this.item?.files?.filter(f => f.storage === 'EXTERNAL_URL');
  }


  changeSubMenu(val: string) {
    this.currentSubMenuSelection = val;
    if(this.currentSubMenuSelection!='admin') {
      sessionStorage.setItem('selectedSubMenuItemView', this.currentSubMenuSelection);
    }
  }


  scrollToCreators() {
    this.changeSubMenu("metadata")
    this.scroller.scrollToAnchor("creators")

  }

  get isLatestVersion() {
    return this.item.versionNumber === this.item.latestVersion?.versionNumber;
  }

  /*
  isAllowed(accessType: string): boolean {
    if(this.authorizationInfo) {
      return this.authorizationInfo[accessType] && this.item.latestVersion?.versionNumber === this.item.versionNumber;
    }
    return false;
  }

  get isAllowedForLatestVersion(accessType: string): boolean {
    if(this.latestVersionAuthorizationInfo) {
      return this.latestVersionAuthorizationInfo[accessType];
    }
    return false;
  }

   */

  submit() {
    this.itemsService.submit(this.item!.objectId!, this.item!.lastModificationDate!, '', this.aaService.token!).subscribe(res => {
      this.init(res.objectId!)
      this.messageService.success("successfully submitted")
    })

  }

  release() {
    this.itemsService.release(this.item!.objectId!, this.item!.lastModificationDate!, '', this.aaService.token!).subscribe(res => {
      this.init(res.objectId!)
      this.messageService.success("successfully released")
    })
  }

  revise() {
    this.itemsService.revise(this.item!.objectId!, this.item!.lastModificationDate!, '', this.aaService.token!).subscribe(res => {
      this.init(res.objectId!)
      this.messageService.success("successfully revised")
    })
  }

  withdraw() {
    this.itemsService.withdraw(this.item!.objectId!, this.item!.lastModificationDate!, '', this.aaService.token!).subscribe(res => {
      this.init(res.objectId!)
      this.messageService.success("successfully withdrawn")
    })
  }

  delete() {
    this.itemsService.delete(this.item!.objectId!, this.item!.lastModificationDate!, this.aaService.token!).subscribe(res => {
      this.router.navigate(['my'])
      this.messageService.success("successfully deleted")
    })
  }
}
