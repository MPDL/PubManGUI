import {Component, HostListener, Input} from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import {CartService} from "../../services/cart.service";
import {AaService} from "../../../services/aa.service";
import {TopnavCartComponent} from "./topnav-cart/topnav-cart.component";
import {TopnavBatchComponent} from "./topnav-batch/topnav-batch.component";
import {PaginatorComponent} from "../paginator/paginator.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'pure-topnav',
  standalone: true,
  imports: [
    RouterLink,
    NgbTooltip,
    TopnavCartComponent,
    TopnavBatchComponent,
    PaginatorComponent,
    NgClass
  ],
  templateUrl: './topnav.component.html'
})
export class TopnavComponent {
  protected isScrolled: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private message: MessageService,
    private bs: BatchService,
    private cartService: CartService,
  protected aaService: AaService) {}

  do_some_navigation(target: string) {
    alert('navigating 2 ' + target);
  }



  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }




}
