import { Component } from '@angular/core';
import { ItemsService } from "../../services/pubman-rest-client/items.service";
import { AaService } from "../../services/aa.service";
import {
  AccountUserDbVO,
  AuditDbVO,
  FileDbVO,
  ItemVersionState,
  ItemVersionVO,
  Storage,
  Visibility
} from "../../model/inge";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TopnavComponent } from "../../shared/components/topnav/topnav.component";
import { AsyncPipe, DatePipe, ViewportScroller } from "@angular/common";
import { ItemBadgesComponent } from "../../shared/components/item-badges/item-badges.component";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { ItemViewMetadataComponent } from "./item-view-metadata/item-view-metadata.component";
import { forkJoin, map, Observable, timer } from "rxjs";
import { environment } from 'src/environments/environment';
import {
  ItemViewMetadataElementComponent
} from "./item-view-metadata/item-view-metadata-element/item-view-metadata-element.component";
import { SanitizeHtmlPipe } from "../../shared/services/pipes/sanitize-html.pipe";
import { ItemViewFileComponent } from "./item-view-file/item-view-file.component";
import { EmptyPipe } from "../../shared/services/pipes/empty.pipe";
import { MessageService } from "../../shared/services/message.service";
import { ExportItemsComponent } from "../../shared/components/export-items/export-items.component";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { TopnavBatchComponent } from "../../shared/components/topnav/topnav-batch/topnav-batch.component";
import { TopnavCartComponent } from "../../shared/components/topnav/topnav-cart/topnav-cart.component";
import { ItemListStateService } from "../item-list/item-list-state.service";
import { SanitizeHtmlCitationPipe } from "../../shared/services/pipes/sanitize-html-citation.pipe";
import { ItemSelectionService } from "../../shared/services/item-selection.service";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { ItemActionsModalComponent } from "../../shared/components/item-actions-modal/item-actions-modal.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { TranslatePipe } from "@ngx-translate/core";
import { itemToVersionId } from "../../shared/services/utils";
import { UsersService } from "../../services/pubman-rest-client/users.service";
import sanitizeHtml from "sanitize-html";
import { CopyButtonDirective } from "../../shared/directives/copy-button.directive";

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
    PaginatorComponent,
    TopnavCartComponent,
    TopnavBatchComponent,
    SanitizeHtmlCitationPipe,
    NgbTooltip,
    LoadingComponent,
    TranslatePipe,
    DatePipe,
    CopyButtonDirective
  ],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.scss'
})
export class ItemViewComponent {
  protected ingeUri = environment.inge_uri;
  currentSubMenuSelection = "abstract";

  versions$!: Observable<AuditDbVO[]>;
  versionMap$!: Observable<Map<number, AuditDbVO[]>>;
  item$!: Observable<ItemVersionVO>;

  item: ItemVersionVO | undefined;

  authorizationInfo: any;

  latestVersionAuthorizationInfo: any;

  citation: string | undefined

  thumbnailUrl: string | undefined;
  firstPublicPdfFile: FileDbVO | undefined;

  itemModifier$!: Observable<AccountUserDbVO>;
  itemCreator$!: Observable<AccountUserDbVO>;

  metaTagElements: Element[] = [];
  copiedSuccessful: boolean = false;


  constructor(private itemsService: ItemsService, private usersService: UsersService, protected aaService: AaService, private route: ActivatedRoute, private router: Router,
  private scroller: ViewportScroller, private messageService: MessageService, private modalService: NgbModal, protected listStateService: ItemListStateService, private itemSelectionService: ItemSelectionService,
              private title: Title, private meta: Meta, private domSanitizer: DomSanitizer) {

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

    this.removeMetaTags();
    this.item = undefined
    this.thumbnailUrl = undefined;
    this.firstPublicPdfFile = undefined
    this.authorizationInfo = undefined;
    this.latestVersionAuthorizationInfo = undefined;
    if (id)
      this.item$ = this.itemsService.retrieve(id);
      this.item$.subscribe(i => {
      if (i && i.objectId) {

        //set HTMl title
        if(i.metadata?.title) {
          const sanitizedTitle = sanitizeHtml(i.metadata.title, {allowedTags: []}) + ' | ' + this.title.getTitle();
          this.title.setTitle(sanitizedTitle);
        }


        //init item in selection and state (for export, basket, batch, pagination etc)
        this.listStateService.initItemId(i.objectId);
        this.itemSelectionService.addToSelection(itemToVersionId(i));


        //Get versions and create version map
        this.versions$ = this.itemsService.retrieveHistory(i.objectId);
        this.versionMap$ = this.versions$.pipe(
          map(versions => {
            const vMap: Map<number, AuditDbVO[]> = new Map();
            versions.forEach((auditEntry) => {
              const mapEntry = vMap.get(auditEntry.pubItem.versionNumber!);
              let auditForVersionNumber: AuditDbVO[] = [];
              if(mapEntry) {
                auditForVersionNumber = mapEntry;
              }
              auditForVersionNumber.push(auditEntry);
              vMap.set(auditEntry.pubItem.versionNumber!, auditForVersionNumber);
            })
            return vMap;
        }))

        this.itemCreator$ = this.usersService.retrieve(i!.creator!.objectId);
        this.itemModifier$ = this.usersService.retrieve(i!.modifier!.objectId);

        //retrieve authorization information for item (for relase, submit, etc...)
        this.itemsService.retrieveAuthorizationInfo(itemToVersionId(i)).subscribe(authInfo => {
          this.authorizationInfo = authInfo;
          if(i.latestVersion?.versionNumber===i.versionNumber) {
            this.latestVersionAuthorizationInfo = this.authorizationInfo;
          }
          else {
            if (i && i.objectId) {
              this.itemsService.retrieveAuthorizationInfo(itemToVersionId(i.latestVersion!)).subscribe(authInfoLv => {
                this.latestVersionAuthorizationInfo = authInfoLv
              })
            }
          }
        })

        //Retrieve citation for item view
        this.itemsService.retrieveSingleCitation(itemToVersionId(i), undefined,undefined).subscribe(citation => {
          this.citation = citation;
        })


        //retrieve thumbnail, if available
        this.firstPublicPdfFile = i?.files?.find(f => (f.storage === Storage.INTERNAL_MANAGED && f.visibility === Visibility.PUBLIC && f.mimeType==='application/pdf'));
        if(this.firstPublicPdfFile) {
          this.itemsService.thumbnailAvalilable(i.objectId, this.firstPublicPdfFile.objectId).subscribe(thumbAvailable => {
              this.thumbnailUrl =  this.ingeUri + this.firstPublicPdfFile?.content.replace('/content', '/thumbnail')
          })
        }


        this.addMetaTags(i);


        //Set item
        this.item = i;
      }
    })
  }

  ngOnDestroy() {
    //Remove meta tags from DOM
    this.removeMetaTags();
  }

  removeMetaTags() {
    this.metaTagElements.forEach(element => {
      document.head.removeChild(element);
    });
    this.metaTagElements = [];
  }


  addMetaTags(i: ItemVersionVO) {

    if(i.versionState== ItemVersionState.RELEASED && i.publicState== ItemVersionState.RELEASED) {
      //Add DC and highwire Press citation meta tags
      forkJoin({
        dc: this.itemsService.retrieveSingleExport(itemToVersionId(i), "Html_Metatags_Dc_Xml", undefined, undefined, true, "text"),
        highwire: this.itemsService.retrieveSingleExport(itemToVersionId(i), "Html_Metatags_Highwirepress_Cit_Xml", undefined, undefined, true, "text")
      })
        .subscribe(
          res => {
            const div = document.createElement('div');
            div.innerHTML = res.dc + res.highwire;
            Array.from(div.children).forEach(child => {
              this.metaTagElements.push(child);
              document.head.append(child)
            })
          }
        );
    }
    else if (i.publicState== ItemVersionState.WITHDRAWN) {
      //Add no-index meta tag
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex';
      this.metaTagElements.push(meta);
      document.head.append(meta);
    }
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

  get isModeratorOrDepositor() {
    return this.item && this.aaService.isLoggedIn &&
    ((this.item?.creator?.objectId === this.aaService.principal.value.user?.objectId)
      || (this.aaService.principal.value.moderatorContexts.map(c => c.objectId).includes(this.item.context.objectId)));
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


  openActionsModal(type: 'release' | 'submit' | 'revise' | 'withdraw' | 'delete' | 'addDoi' | 'rollback', rollbackVersion?:number) {
    const comp: ItemActionsModalComponent = this.modalService.open(ItemActionsModalComponent).componentInstance;
    comp.item = this.item!;
    comp.action = type;
    if(type==='rollback') {
      comp.rollbackVersion = rollbackVersion;
    }
    comp.successfullyDone.subscribe(data => {
      this.listStateService.itemUpdated.next(this.item?.objectId);
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

  protected readonly timer = timer;
}
