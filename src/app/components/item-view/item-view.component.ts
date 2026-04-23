import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ItemsService } from "../../services/pubman-rest-client/items.service";
import { AaService } from "../../services/aa.service";
import {
  AccountUserDbVO, AlternativeTitleType,
  AuditDbVO,
  FileDbVO,
  ItemVersionState,
  ItemVersionVO,
  Storage,
  Visibility
} from "../../model/inge";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TopnavComponent } from "../shared/topnav/topnav.component";
import { AsyncPipe, DatePipe, isPlatformBrowser, isPlatformServer, NgOptimizedImage, ViewportScroller } from "@angular/common";
import { ItemBadgesComponent } from "../shared/item-badges/item-badges.component";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { ItemViewMetadataComponent } from "./item-view-metadata/item-view-metadata.component";
import { catchError, finalize, forkJoin, map, Observable, tap, throwError, timer } from "rxjs";
import {
  ItemViewMetadataElementComponent
} from "./item-view-metadata/item-view-metadata-element/item-view-metadata-element.component";
import { SanitizeHtmlPipe } from "../../pipes/sanitize-html.pipe";
import { ItemViewFileComponent } from "./item-view-file/item-view-file.component";
import { NotEmptyPipe } from "../../pipes/notEmpty.pipe";
import { MessageService } from "../../services/message.service";
import { ExportItemsComponent } from "../shared/export-items/export-items.component";
import { PaginatorComponent } from "../shared/paginator/paginator.component";
import { TopnavBatchComponent } from "../shared/topnav/topnav-batch/topnav-batch.component";
import { TopnavCartComponent } from "../shared/topnav/topnav-cart/topnav-cart.component";
import { ItemListStateService } from "../item-list/item-list-state.service";
import { SanitizeHtmlCitationPipe } from "../../pipes/sanitize-html-citation.pipe";
import { ItemSelectionService } from "../../services/item-selection.service";
import {Meta, Title} from "@angular/platform-browser";
import { ItemActionsModalComponent } from "../shared/item-actions-modal/item-actions-modal.component";
import { LoadingComponent } from "../shared/loading/loading.component";
import { TranslatePipe } from "@ngx-translate/core";
import { itemToVersionId } from "../../utils/utils";
import { UsersService } from "../../services/pubman-rest-client/users.service";
import sanitizeHtml from "sanitize-html";
import { CopyButtonDirective } from "../../directives/copy-button.directive";
import { PubManHttpErrorResponse } from "../../services/interceptors/http-error.interceptor";
import { ChangeContextModalComponent } from "../shared/change-context-modal/change-context-modal.component";
import { UpdateLocaltagsModalComponent } from "../shared/update-localtags-modal/update-localtags-modal.component";
import { getThumbnailUrlForFile, getUrlForFile } from "../../utils/item-utils";
import { MatomoTracker } from "ngx-matomo-client";
import { ConeIconComponent } from "../shared/cone-icon/cone-icon.component";
import { MetaTagsTransformerService } from 'src/app/services/meta-tags-transformer.service';

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
    NgOptimizedImage,
    SanitizeHtmlPipe,
    ItemViewFileComponent,
    NotEmptyPipe,
    PaginatorComponent,
    TopnavCartComponent,
    TopnavBatchComponent,
    SanitizeHtmlCitationPipe,
    NgbTooltip,
    LoadingComponent,
    TranslatePipe,
    DatePipe,
    CopyButtonDirective,
    ConeIconComponent
  ],
  templateUrl: './item-view.component.html'
})
export class ItemViewComponent {
  loading=false;

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
  firstPublicPdfFileUrl: string | undefined;

  itemModifier$!: Observable<AccountUserDbVO>;
  itemCreator$!: Observable<AccountUserDbVO>;

  // track meta selectors added via Meta service for removal
  metaTagSelectors: string[] = [];
  copiedSuccessful: boolean = false;

  errorMessages: string[] = [];

  constructor(private itemsService: ItemsService, private usersService: UsersService, protected aaService: AaService, private route: ActivatedRoute, private router: Router,
  private scroller: ViewportScroller, private messageService: MessageService, private modalService: NgbModal, protected listStateService: ItemListStateService, private itemSelectionService: ItemSelectionService,
  private title: Title, private meta: Meta, private matomoTracker: MatomoTracker, @Inject(PLATFORM_ID) private platformId: any, private metaTagService: MetaTagsTransformerService) {

  }



  ngOnInit()
  {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')
      if(id) {
          this.init(id);
      }
    })

    if (isPlatformBrowser(this.platformId)) {
      const subMenu = sessionStorage.getItem('selectedSubMenuItemView');
      if(subMenu) {
        this.currentSubMenuSelection = subMenu;
      }
    }


  }

  init(id:string) {

    //console.log("init " + id);

    this.loading = true;
    this.removeMetaTags();
    this.item = undefined
    this.thumbnailUrl = undefined;
    this.firstPublicPdfFile = undefined
    this.authorizationInfo = undefined;
    this.latestVersionAuthorizationInfo = undefined;
    if (id)
      this.item$ = this.itemsService.retrieve(id, {globalErrorDisplay: true});
      this.item$
        .pipe(
          tap(i => {
            if (i.objectId) {

              //set HTMl title
              if (i.metadata?.title) {
                const sanitizedTitle = sanitizeHtml(i.metadata.title, {allowedTags: []}) + ' | ' + this.title.getTitle();
                this.title.setTitle(sanitizedTitle);
              }
              //this.matomoTracker.trackPageView(i.metadata?.title);

              //init item in selection and state (for export, basket, batch, pagination etc)
              this.listStateService.initItemId(i.objectId);
              this.itemSelectionService.addToSelection(itemToVersionId(i));

              //Get versions and create version map
              this.initVersions(i);

              //Get creator and modifier
              this.itemCreator$ = this.usersService.retrieve(i!.creator!.objectId);
              this.itemModifier$ = this.usersService.retrieve(i!.modifier!.objectId);

              //retrieve authorization information for item (for relase, submit, etc...)
              this.itemsService.retrieveAuthorizationInfo(itemToVersionId(i))
                .pipe(
                  tap(authInfo => {
                    this.authorizationInfo = authInfo;
                    if (i.latestVersion?.versionNumber === i.versionNumber) {
                      this.latestVersionAuthorizationInfo = this.authorizationInfo;
                    } else {
                      if (i && i.objectId) {
                        this.itemsService.retrieveAuthorizationInfo(itemToVersionId(i.latestVersion!)).subscribe(authInfoLv => {
                          this.latestVersionAuthorizationInfo = authInfoLv
                        })
                      }
                    }
                  })
                )
                .subscribe()

              //Retrieve citation for item view
              this.itemsService.retrieveSingleCitation(itemToVersionId(i), undefined, undefined).subscribe(citation => {
                this.citation = citation;
              })


              //retrieve thumbnail, if available
              this.firstPublicPdfFile = i?.files?.find(f => (f.storage === Storage.INTERNAL_MANAGED && f.visibility === Visibility.PUBLIC && f.mimeType === 'application/pdf'));
              this.firstPublicPdfFileUrl = getUrlForFile(this.firstPublicPdfFile);
              if (this.firstPublicPdfFile) {
                this.itemsService.thumbnailAvalilable(i.objectId, this.firstPublicPdfFile.objectId!, {globalErrorDisplay: false}).subscribe(thumbAvailable => {
                  this.thumbnailUrl = getThumbnailUrlForFile(this.firstPublicPdfFile);

                })
              }

              this.addMetaTags(i);

              //Set item
              this.item = i;
            }
          }),
          catchError((err: PubManHttpErrorResponse) => {
            //this.errorMessages.push(err.userMessage);
            //return EMPTY;
            return throwError(err)
          }),
           finalize(() => {
             this.loading = false;
           })

        )
        .subscribe()
  }

  ngOnDestroy() {
    //Remove meta tags from DOM
    this.removeMetaTags();
  }

  initVersions(i: ItemVersionVO) {
    this.versions$ = this.itemsService.retrieveHistory(i.objectId!);
    this.versionMap$ = this.versions$.pipe(
      map(versions => {
        const vMap: Map<number, AuditDbVO[]> = new Map();
        versions.forEach((auditEntry) => {
          const mapEntry = vMap.get(auditEntry.pubItem.versionNumber!);
          let auditForVersionNumber: AuditDbVO[] = [];
          if (mapEntry) {
            auditForVersionNumber = mapEntry;
          }
          auditForVersionNumber.push(auditEntry);
          vMap.set(auditEntry.pubItem.versionNumber!, auditForVersionNumber);
        })
        return vMap;
      }))
  }

  removeMetaTags() {
    // Remove tags added via Angular Meta service
    this.metaTagSelectors.forEach(selector => {
      try {
        this.meta.removeTag(selector);
      } catch (e) {
        // ignore
      }
    });
    this.metaTagSelectors = [];
  }


  addMetaTags(i: ItemVersionVO) {


    if (i.versionState == ItemVersionState.RELEASED && i.publicState == ItemVersionState.RELEASED) {
      /*
      forkJoin({
        dc: this.itemsService.retrieveSingleExport(itemToVersionId(i), 'Html_Metatags_Dc_Xml', undefined, undefined, { responseType: 'text' }),
        highwire: this.itemsService.retrieveSingleExport(itemToVersionId(i), 'Html_Metatags_Highwirepress_Cit_Xml', undefined, undefined, { responseType: 'text' })
      }).subscribe(res => {
        const html = (res.dc || '') + (res.highwire || '');
        this._parseAndAddMetaHtml(html);
      });

      */
     this.metaTagService.transformAndSetMetaTags(i);

    } else if (i.publicState == ItemVersionState.WITHDRAWN) {
      try {
        this.meta.addTag({ name: 'robots', content: 'noindex' }, false);
        this.metaTagSelectors.push('name="robots"');
      } catch (e) {
        // ignore
      }
    }
  }

  private _parseAndAddMetaHtml(html: string) {
    const metaTagRegex = /<meta\s+([^>]+)>/gi;
    let match: RegExpExecArray | null;
    while ((match = metaTagRegex.exec(html)) !== null) {
      const attrString = match[1];
      const attrs: Record<string, string> = {};
      const attrPairs = attrString.match(/(\w[\w-]*\s*=\s*("[^"]*"|'[^']*'))/g) || [];
      attrPairs.forEach(pair => {
        const idx = pair.indexOf('=');
        if (idx > 0) {
          const name = pair.substring(0, idx).trim();
          let val = pair.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          attrs[name.toLowerCase()] = val;
        }
      });

      const def: any = {};
      let selector = '';
      if (attrs['name']) {
        def.name = attrs['name'];
        selector = `name="${attrs['name']}"`;
      } else if (attrs['property']) {
        def.property = attrs['property'];
        selector = `property="${attrs['property']}"`;
      } else if (attrs['http-equiv']) {
        def.httpEquiv = attrs['http-equiv'];
        selector = `http-equiv="${attrs['http-equiv']}"`;
      } else if (attrs['charset']) {
        def.charset = attrs['charset'];
        selector = `charset="${attrs['charset']}"`;
      }

      if (attrs['content']) {
        def.content = attrs['content'];
      }

      try {
        if (Object.keys(def).length > 0) {
          this.meta.addTag(def, false);
          if (selector) this.metaTagSelectors.push(selector);
        }
      } catch (e) {
        // ignore
      }
    }
  }

  get firstAuthors() {
    return this.item?.metadata?.creators?.slice(0,10);
  }

  get storedFiles() {
   return this.item?.files?.filter(f => f.storage === Storage.INTERNAL_MANAGED);
  }

  get externalReferences() {
    return this.item?.files?.filter(f => f.storage === Storage.EXTERNAL_URL);
  }

  get firstSubtitle() {
    return this.item?.metadata?.alternativeTitles?.find(at => at.type === AlternativeTitleType.SUBTITLE) ||
    this.item?.metadata?.alternativeTitles?.find(at => at.type === AlternativeTitleType.OTHER) ||
      this.item?.metadata?.alternativeTitles?.at(0);
  }

  get isModeratorOrDepositor() {
    return this.item && this.aaService.isLoggedIn &&
    ((this.item?.creator?.objectId === this.aaService.principal.value.user?.objectId)
      || (this.aaService.principal.value.moderatorContexts.map(c => c.objectId).includes(this.item.context!.objectId)));
  }





  changeSubMenu(val: string) {
    this.currentSubMenuSelection = val;
    if (this.currentSubMenuSelection != 'admin') {
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('selectedSubMenuItemView', this.currentSubMenuSelection);
      }
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
      //this.listStateService.itemUpdated.next(this.item?.objectId);
      if(type !== 'delete') {
        this.init(this.item?.objectId!)
      }
      else {this.router.navigate(['/my']);
      }

    })

  }

  openExportModal() {
    const comp: ExportItemsComponent = this.modalService.open(ExportItemsComponent).componentInstance;
    comp.type = "exportSingle";
    //comp.item = this.item;
  }


  useAsTemplate() {
    this.router.navigate(['/edit'], {queryParams: {'template' : itemToVersionId(this.item!)}});
  }

  protected readonly timer = timer;


  openChangeContextModal() {
    const changeContextComp: ChangeContextModalComponent = this.modalService.open(ChangeContextModalComponent).componentInstance;
    changeContextComp.item = this.item!;
    changeContextComp.successfullyDone.subscribe(data => {
      //this.listStateService.itemUpdated.next(this.item?.objectId);
      this.init(itemToVersionId(this.item!));
    })
  }

  openUpdateLocalTagsModal() {
    const updateLocalTagsModal: UpdateLocaltagsModalComponent = this.modalService.open(UpdateLocaltagsModalComponent).componentInstance;
    updateLocalTagsModal.item = this.item!;
    updateLocalTagsModal.successfullyDone.subscribe(data => {
      //this.listStateService.itemUpdated.next(this.item?.objectId);
      this.init(itemToVersionId(this.item!));
    })
  }

}
