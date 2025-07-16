import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { CartService } from "../../services/cart.service";
import { AaService } from "../../../services/aa.service";
import { NgClass } from "@angular/common";

@Component({
  selector: 'pure-topnav',
  standalone: true,
  imports: [
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
    this.isScrolled = scrollPosition > 20 ? true : false;
  }




}
