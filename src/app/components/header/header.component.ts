import { afterNextRender, Component, ElementRef, HostListener, inject, Injector, ChangeDetectionStrategy, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AaComponent } from '../aa/aa.component';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { AaService } from 'src/app/services/aa.service';
import { LangSwitchComponent } from 'src/app/components/shared/lang-switch/lang-switch.component';

import { TranslatePipe } from "@ngx-translate/core";
import { NgbPopover, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { SearchComponent } from 'src/app/components/shared/search/search.component';
import { ToolsnavComponent } from 'src/app/components/shared/toolsnav/toolsnav.component';
import {environment} from "../../../environments/environment";
import { MobileNavService } from '../shared/sidenav/mobile-nav.service';


@Component({
  selector: 'pure-header',
  templateUrl: './header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    LangSwitchComponent,
    AaComponent,
    NgClass,
    TranslatePipe,
    NgbTooltip,
    SearchComponent,
    ToolsnavComponent,
    NgbPopover,
  ]
})
export class HeaderComponent {

  aa = inject(AaService);
  mobileNav = inject(MobileNavService);

  searchOpen = signal(false);
  private mobileSearch = viewChild<ElementRef<HTMLElement>>('mobileSearch');
  private injector = inject(Injector);

  private readonly platformId = inject(PLATFORM_ID);
  isScrolled = false;

  toggleSearch() {
    const open = !this.searchOpen();
    this.searchOpen.set(open);
    afterNextRender(
      () => {
        if (open) {
          // focus the input of the freshly rendered search row, once it is in the DOM
          this.mobileSearch()?.nativeElement.querySelector('input')?.focus();
        }
      },
      { injector: this.injector }
    );
  }

  get singleIPAdress() {
    const ip= this.aa.principal.value.ipAddress;
    if(ip?.includes(',')) {
      return ip.split(',')[0];
    } else {
      return ip;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }

  protected readonly environment = environment;
}
