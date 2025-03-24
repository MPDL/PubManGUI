import {Component, inject, Input} from '@angular/core';
import {FileDbVO, ItemVersionVO, Storage, Visibility} from 'src/app/model/inge';
import {NgClass} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PopoverDirective} from 'src/app/shared/directives/popover.directive';
import {Subscription} from 'rxjs';
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {SanitizeHtmlPipe} from "../../../shared/services/pipes/sanitize-html.pipe";
import {ItemBadgesComponent} from "../../../shared/components/item-badges/item-badges.component";
import {ItemSelectionService} from "../../../shared/services/item-selection.service";
import * as props from "../../../../assets/properties.json";

@Component({
  selector: 'pure-item-list-element',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule, PopoverDirective, NgbTooltip, RouterLink, SanitizeHtmlPipe, ItemBadgesComponent],
  templateUrl: './item-list-element.component.html',
  styleUrl: './item-list-element.component.scss'
})
export class ItemListElementComponent {

  @Input() item: ItemVersionVO | undefined;
  @Input() last_item!: boolean;
  @Input()
  authenticated = false;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  check_box = new FormControl(false);
  check_box_subscription: Subscription = new Subscription();
  savedSelection = this.activatedRoute.snapshot.routeConfig?.path + "-checked";

  no_name = 'n/a';

  files: FileDbVO[] = [];
  publicFiles: FileDbVO[] = [];
  locators: FileDbVO[] = [];

  protected ingeUri = props.inge_uri;


  constructor(private itemSelectionService: ItemSelectionService) {
  }

  ngOnInit() {
    if (this.item?.objectId) {
      const objectId = this.item.objectId;
      this.check_box.setValue(false);

      this.itemSelectionService.selectedIds$.subscribe(currentIds => {
        if(currentIds.includes(this.item!.objectId!)) {
          this.check_box.setValue(true, {emitEvent: false});
        }
        else {
          this.check_box.setValue(false, {emitEvent: false});
        }
      })

      this.check_box_subscription =
        this.check_box.valueChanges.subscribe(val => {
          this.setStoredCheckBoxState(this.check_box.value as boolean);
        });

      this.files = this.item.files?.filter(f => f.storage === Storage.INTERNAL_MANAGED) || [];
      this.publicFiles = this.files.filter(f => f.visibility === Visibility.PUBLIC);
      this.locators = this.item.files?.filter(f => f.storage === Storage.EXTERNAL_URL) || [];

    }
  }

  get abstract() {
    if (this.item && this.item?.metadata?.abstracts?.length > 0) {
      return this.item?.metadata.abstracts[0].value;
    } else {
      return undefined;
    }
  }

  get creators_length() {
    return this.item?.metadata?.creators?.length;
  }

  get first_three_authors() {
    if (this.creators_length && this.creators_length > 0) {
      return this.item?.metadata.creators.slice(0, 3);
    } else {
      return null;
    }
  }

  show() {
    // alert(JSON.stringify(item, undefined, 2));
    this.router.navigate(['edit', this.item?.objectId])
  }

  setStoredCheckBoxState(isChecked: boolean) {
    if(isChecked) {
      this.itemSelectionService.addToSelection(this.item!.objectId!)
    }
    else {
      this.itemSelectionService.removeFromSelection(this.item!.objectId!)
    }

    /*
    let fromSelection: string[] = [];
    if (sessionStorage.getItem(this.savedSelection)) {
      fromSelection = JSON.parse(sessionStorage.getItem(this.savedSelection) as string);
    }

    if (fromSelection.length > 0) {
      const pos = fromSelection.indexOf(this.item?.objectId as string);
      if (pos < 0) {
        if (isChecked) {
          fromSelection.push(this.item?.objectId as string);      }
      } else {
        if (!isChecked) {
          fromSelection.splice(pos, 1);
        }
      }
    } else {
      if (isChecked) fromSelection.push(this.item?.objectId as string);
    }

    sessionStorage.setItem(this.savedSelection, JSON.stringify(fromSelection));

     */
  }

  get sourceCitation() {
    if(this.item?.metadata?.sources && this.item.metadata.sources.length > 0) {
      return this.item.metadata.sources[0].title;
    }
    else return undefined;
  }


  protected readonly Visibility = Visibility;
}
