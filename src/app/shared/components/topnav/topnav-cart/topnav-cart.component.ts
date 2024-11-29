import {Component, Input} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MessageService} from "../../../services/message.service";
import {BatchService} from "../../../../components/batch/services/batch.service";
import {CartService} from "../../../services/cart.service";
import {AaService} from "../../../../services/aa.service";
import {ItemListComponent} from "../../../../components/item-list/item-list.component";
import {ItemSelectionService} from "../../../services/item-selection.service";

@Component({
  selector: 'pure-topnav-cart',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './topnav-cart.component.html',
  //styleUrl: './topnav-cart.component.scss'
})
export class TopnavCartComponent {

  //@Input({required: true}) selectedItems: string[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private message: MessageService,
    private cartService: CartService,
    private itemSelectionService: ItemSelectionService,
    protected aaService: AaService) {}

  addSelectedToCart() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected.length) {
      const added = this.cartService.addItems(selected)
      this.itemSelectionService.resetList();

      this.message.success(selected + ' items selected' + ((selected.length! - added) > 0 ? `, ${selected.length! - added} on cart duplicated were ignored.` : ''));
    } else {
      this.message.warning(`The cart is empty!\n`);
    }
  }

  removeSelectedFromCart() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if (selected.length) {
      const removed = this.cartService.removeItems(selected)
      this.itemSelectionService.resetList();
      this.message.success(selected + ' items selected' + ((selected.length! - removed) > 0 ? `, ${selected.length! - removed} on cart duplicated were ignored.` : ''));
    } else {
      this.message.warning(`The cart is empty!\n`);
    }
  }

  get isAdd() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0)
    {
      return selected.some(id => !this.cartService.objectIds.includes(id))
    }
    return false;
    //console.log("isAdd: " + isAdd)
    //return isAdd
  }
  get isRemove() {
    const selected: string[] = this.itemSelectionService.selectedIds$.value;
    if(selected.length > 0) {
      return selected.some(id => this.cartService.objectIds.includes(id))
    }
    return false;
  }

}
