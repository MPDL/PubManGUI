import {Component, HostListener, Input} from '@angular/core';
import {ItemsService} from "../../services/pubman-rest-client/items.service";
import {AaService} from "../../services/aa.service";
import {ItemVersionVO} from "../../model/inge";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {TopnavComponent} from "../../shared/components/topnav/topnav.component";
import {AsyncPipe, NgClass, ViewportScroller} from "@angular/common";
import {DateToYearPipe} from "../../shared/services/pipes/date-to-year.pipe";
import {ItemBadgesComponent} from "../../shared/components/item-badges/item-badges.component";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {ItemViewMetadataComponent} from "./item-view-metadata/item-view-metadata.component";
import {BehaviorSubject, delay, Observable, pipe, timeout} from "rxjs";
import * as props from "../../../assets/properties.json";
import {
  ItemViewMetadataElementComponent
} from "./item-view-metadata/item-view-metadata-element/item-view-metadata-element.component";
import {SanitizeHtmlPipe} from "../../shared/services/pipes/sanitize-html.pipe";
import {ItemViewFileComponent} from "./item-view-file/item-view-file.component";

@Component({
  selector: 'pure-item-view',
  standalone: true,
  imports: [
    TopnavComponent,
    NgClass,
    DateToYearPipe,
    ItemBadgesComponent,
    RouterOutlet,
    NgbTooltip,
    RouterLink,
    ItemViewMetadataComponent,
    ItemViewMetadataElementComponent,
    AsyncPipe,
    SanitizeHtmlPipe,
    ItemViewFileComponent
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
  isScrolled: boolean = false;

  constructor(private itemsService: ItemsService, protected aaService: AaService, private route: ActivatedRoute,
  private scroller: ViewportScroller) {

  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    //console.log(id);
    if (id)
      this.item$ = this.itemsService.retrieve(id, this.aaService.token);
      this.item$
        .subscribe(i => {
      if (i && i.objectId) {
        this.item = i;
        this.versions$ = this.itemsService.retrieveHistory(i.objectId, this.aaService.token);
      }
    })

    const subMenu = sessionStorage.getItem('selectedSubMenuItemView');
    if(subMenu) {
      this.currentSubMenuSelection = subMenu;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
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
}
