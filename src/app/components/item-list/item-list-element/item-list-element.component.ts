import { Component, Input, inject } from '@angular/core';
import {IdType, ItemVersionVO} from 'src/app/model/inge';
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverDirective } from 'src/app/shared/directives/popover.directive';
import { Subscription } from 'rxjs';
import {NgbPopover, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {SanitizeHtmlPipe} from "../../../shared/services/pipes/sanitize-html.pipe";
import {DateToYearPipe} from "../../../shared/services/pipes/date-to-year.pipe";
import {ItemBadgesComponent} from "../../../shared/components/item-badges/item-badges.component";
import {ExportItemsComponent} from "../../../shared/components/export-items/export-items.component";
import {ItemSelectionService} from "../../../shared/services/item-selection.service";

@Component({
  selector: 'pure-item-list-element',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, JsonPipe, FormsModule, ReactiveFormsModule, PopoverDirective, NgbTooltip, RouterLink, SanitizeHtmlPipe, DateToYearPipe, ItemBadgesComponent, ExportItemsComponent, NgbPopover],
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

  dummy_citation = `Eisner, D., Neher, E., Taschenberger, H., & Smith, G. (2023).
  Physiology of intracellular calcium buffering. Physiological Reviews, 103(4), 2767-2845.
  doi:10.1152/physrev.00042.2022. `


  constructor(private itemSelectionService: ItemSelectionService) {
  }

  ngAfterViewInit() {
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

}
