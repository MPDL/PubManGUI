import {Component, HostListener, Input, TemplateRef} from '@angular/core';
import {ItemsService} from "../../services/pubman-rest-client/items.service";
import {AaService} from "../../services/aa.service";
import {FileDbVO, ItemVersionVO, Storage, Visibility} from "../../model/inge";
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet} from "@angular/router";
import {TopnavComponent} from "../../shared/components/topnav/topnav.component";
import {AsyncPipe, NgClass, ViewportScroller} from "@angular/common";
import {DateToYearPipe} from "../../shared/services/pipes/date-to-year.pipe";
import {ItemBadgesComponent} from "../../shared/components/item-badges/item-badges.component";
import {NgbModal, NgbPopover, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {ItemViewMetadataComponent} from "./item-view-metadata/item-view-metadata.component";
import {BehaviorSubject, delay, map, Observable, pipe, tap, timeout} from "rxjs";
import { environment } from 'src/environments/environment';
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
import {ItemListStateService} from "../item-list/item-list-state.service";
import {SanitizeHtmlCitationPipe} from "../../shared/services/pipes/sanitize-html-citation.pipe";
import {ItemSelectionService} from "../../shared/services/item-selection.service";
import {Title} from "@angular/platform-browser";
import {ItemActionsModalComponent} from "../../shared/components/item-actions-modal/item-actions-modal.component";
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {TranslatePipe} from "@ngx-translate/core";

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
    ExportItemsComponent,
    PaginatorComponent,
    TopnavCartComponent,
    TopnavBatchComponent,
    SanitizeHtmlCitationPipe,
    NgbTooltip,
    LoadingComponent,
    TranslatePipe
  ],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.scss'
})
export class ItemViewComponent {
  protected ingeUri = environment.inge_uri;
  currentSubMenuSelection = "abstract";

  versions$!: Observable<any>;
  item$!: Observable<ItemVersionVO>;

  item: ItemVersionVO | undefined;

  authorizationInfo: any;

  latestVersionAuthorizationInfo: any;

  citation: string | undefined

  thumbnailUrl: string | undefined;
  firstPublicPdfFile: FileDbVO | undefined;

  constructor(private itemsService: ItemsService, protected aaService: AaService, private route: ActivatedRoute, private router: Router,
  private scroller: ViewportScroller, private messageService: MessageService, private modalService: NgbModal, protected listStateService: ItemListStateService, private itemSelectionService: ItemSelectionService,
              private title: Title) {

  }



  ngOnInit()
  {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      if(id) {
          this.init(id);
      }
    })

    const subMenu = sessionStorage.getItem('selectedSubMenuItemView');
    if(subMenu) {
      this.currentSubMenuSelection = subMenu;
    }


  }

  init(id:string) {

    //console.log("init " + id);

    this.item = undefined
    this.thumbnailUrl = undefined;
    this.firstPublicPdfFile = undefined
    this.authorizationInfo = undefined;
    this.latestVersionAuthorizationInfo = undefined;
    if (id)
      this.item$ = this.itemsService.retrieve(id);
      this.item$.subscribe(i => {
      if (i && i.objectId) {

        if(i.metadata?.title) {
          this.title.setTitle(i.metadata.title)
        }

        this.listStateService.initItemId(i.objectId);
        this.itemSelectionService.addToSelection(i.objectId);
        this.versions$ = this.itemsService.retrieveHistory(i.objectId);

        this.itemsService.retrieveAuthorizationInfo(i.objectId + '_' + i.versionNumber).subscribe(authInfo => {
          this.authorizationInfo = authInfo;
          if(i.latestVersion?.versionNumber===i.versionNumber) {
            this.latestVersionAuthorizationInfo = this.authorizationInfo;
          }
          else {
            if (i && i.objectId) {
              this.itemsService.retrieveAuthorizationInfo(i.objectId + '_' + i.latestVersion?.versionNumber).subscribe(authInfoLv => {
                this.latestVersionAuthorizationInfo = authInfoLv
              })
            }
          }
        })

        this.itemsService.retrieveSingleCitation(i.objectId + '_' + i.versionNumber, undefined,undefined).subscribe(citation => {
          this.citation = citation;
        })


        this.firstPublicPdfFile = i?.files?.find(f => (f.storage === Storage.INTERNAL_MANAGED && f.visibility === Visibility.PUBLIC && f.mimeType==='application/pdf'));

        if(this.firstPublicPdfFile) {
          this.itemsService.thumbnailAvalilable(i.objectId, this.firstPublicPdfFile.objectId).subscribe(thumbAvailable => {
              this.thumbnailUrl =  this.ingeUri + this.firstPublicPdfFile?.content.replace('/content', '/thumbnail')
          })
        }
        this.item = i;
      }
    })
  }



  get firstAuthors() {
    return this.item?.metadata.creators.slice(0,10);
  }

  get storedFiles() {
   return this.item?.files?.filter(f => f.storage === Storage.INTERNAL_MANAGED);
  }

  get externalReferences() {
    return this.item?.files?.filter(f => f.storage === Storage.EXTERNAL_URL);
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
    return this.item?.versionNumber === this.item?.latestVersion?.versionNumber;
  }


  openActionsModal(type: 'release' | 'submit' | 'revise' | 'withdraw' | 'delete' | 'addDoi') {
    const comp: ItemActionsModalComponent = this.modalService.open(ItemActionsModalComponent).componentInstance;
    comp.item = this.item!;
    comp.action = type;
    comp.successfullyDone.subscribe(data => {
      if(type !== 'delete') {
        this.init(this.item?.objectId!)
      }
      else {this.router.navigate(['/my']);
      }

    })

  }

  openExportModal() {
    const comp = this.modalService.open(ExportItemsComponent).componentInstance;
    comp.item = this.item;
  }


  useAsTemplate() {
    alert('To do')

  }
}
