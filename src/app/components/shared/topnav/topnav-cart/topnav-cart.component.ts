import { Component, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "../../../../services/message.service";
import { CartService } from "../../../../services/cart.service";
import { AaService } from "../../../../services/aa.service";
import { ItemSelectionService } from "../../../../services/item-selection.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-topnav-cart',
  standalone: true,
  imports: [
    NgbTooltip,
    TranslatePipe
  ],
  host: {
    style: "display: contents"
  },
  templateUrl: './topnav-cart.component.html',
  //styleUrl: './topnav-cart.component.scss'
})
export class TopnavCartComponent {

  //@Input({required: true}) selectedItems: string[] = []
  @Input() resetSelectionAfterAction: boolean = true;
  @Input() displayButtons: 'all' | 'removeOnly' | 'addOnly' | 'allowedOnly' = "all";

  constructor(
    private activatedRoute: ActivatedRoute,
    private message: MessageService,
    private cartService: CartService,
    private itemSelectionService: ItemSelectionService,
    protected aaService: AaService,
    private translateSvc: TranslateService,) {}

  addSelectedToCart() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected.length) {
      const added = this.cartService.addItems(selected)
      if(this.resetSelectionAfterAction)
        this.itemSelectionService.resetList();

      this.message.success(
        this.translateSvc.instant('common.basket') + ": " +
        added + ' ' + this.translateSvc.instant(_('common.datasets.filled'))
        + ((selected.length! - added) > 0 ? ", " + `${selected.length! - added} `
          + this.translateSvc.instant(_('common.datasets.duplicated'))  + "." : '')
      );

      //this.message.success(selected + ' items selected' + ((selected.length! - added) > 0 ? `, ${selected.length! - added} on cart duplicated were ignored.` : ''));
    } else {
      this.message.warning(this.translateSvc.instant(_('common.datasets.empty')));
    }
  }

  removeSelectedFromCart() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected.length) {
      const removed = this.cartService.removeItems(selected)
      if(this.resetSelectionAfterAction)
        this.itemSelectionService.resetList();
      this.message.success(
        this.translateSvc.instant('common.basket') + ": " +
        //selected.length + ' '
        //+ this.translateSvc.instant(_('common.datasets.selected')) + '\n' +
        removed + ' ' + this.translateSvc.instant(_('common.datasets.removed'))
        + ((selected.length! - removed) > 0 ? ", " + `${selected.length! - removed} `
          + this.translateSvc.instant(_('common.datasets.missing')) + "." : '')
      );
    } else {
      this.message.warning(this.translateSvc.instant('common.datasets.empty'));
    }
  }

  get isAdd() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0)
    {
      return selected.some(id => !this.cartService.objectIds$.value.includes(id))
    }
    return false;
    //console.log("isAdd: " + isAdd)
    //return isAdd
  }
  get isRemove() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0) {
      return selected.some(id => this.cartService.objectIds$.value.includes(id))
    }
    return false;
  }

}
