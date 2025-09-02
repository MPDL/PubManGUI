import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
  ViewChild
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AaService } from "../../../services/aa.service";

import { MatBadgeModule } from '@angular/material/badge';
import { BatchNavComponent } from 'src/app/components/batch/batch-nav/batch-nav.component';
import { ImportsNavComponent } from 'src/app/components/imports/imports-nav/imports-nav.component';
import { CartService } from "../../../services/cart.service";

import { TranslatePipe } from "@ngx-translate/core";

import { AaComponent } from 'src/app/components/aa/aa.component';
import { SearchComponent } from 'src/app/components/shared/search/search.component';
import { LangSwitchComponent } from 'src/app/components/shared/lang-switch/lang-switch.component';


@Component({
  selector: 'pure-sidenav',
  standalone: true,
  imports: [RouterLink, MatBadgeModule, CommonModule, BatchNavComponent, ImportsNavComponent, TranslatePipe, AaComponent, SearchComponent, LangSwitchComponent],
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements AfterViewInit {

  @ViewChild('sidenav', { read: ElementRef }) nav!: ElementRef;
  renderer = inject(Renderer2);

  aaService = inject(AaService);
  cartService = inject(CartService);
  private document = inject(DOCUMENT);

  mobile: boolean | null = null;
  mobile_options: HTMLElement | null = null;

  ngOnInit() {
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1199.98 ? true : false;
  }

  ngAfterViewInit(): void {
    this.collapse();
  }

  /*
  ex_col() {
    const expanded = this.nav.nativeElement.classList.contains('collapsed');
    this.renderer[expanded ? 'removeClass' : 'addClass'](this.nav.nativeElement, 'collapsed');
  }
  */

  expand() {
    if (!this.mobile) {
      this.renderer.removeClass(this.nav.nativeElement, 'collapsed');
    }
  }

  collapse() {
    if (this.mobile) {
      if (!this.mobile_options) this.mobile_options = this.document.getElementById('side_nav_mobile_options');
      if (this.mobile_options?.classList.contains('show')) this.mobile_options!.classList.remove('show');
    }
    else {
      this.renderer.addClass(this.nav.nativeElement, 'collapsed');
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1199.98 ? true : false;
    if (!this.mobile) {
      this.collapse();
    } 
  }

}
