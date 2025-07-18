import { Component, DOCUMENT, HostListener, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AaComponent } from '../aa/aa.component';
import { NgClass } from '@angular/common';
import { AaService } from 'src/app/services/aa.service';
import { LangSwitchComponent } from 'src/app/components/shared/lang-switch/lang-switch.component';
import { SidenavComponent } from 'src/app/components/shared/sidenav/sidenav.component';

import { TranslatePipe } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { SearchComponent } from 'src/app/components/shared/search/search.component';


@Component({
  selector: 'pure-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    LangSwitchComponent,
    AaComponent,
    SidenavComponent,
    NgClass,
    TranslatePipe,
    NgbTooltip,
    SearchComponent,
  ]
})
export class HeaderComponent {

  aa = inject(AaService);

  headerHeight: number = 0;
  header!: HTMLElement;
  private document = inject(DOCUMENT);
  isScrolled = false;

  ngOnInit() {
    const nav = this.document.getElementById('header');
    if (nav) {
      this.header = nav;
    }
    this.headerHeight = this.header.offsetHeight as number;
  }

  tools() {
    alert('select from tools ...');
  }

  switch_lang() {
    const loc = localStorage.getItem('locale');
    if (loc?.localeCompare('de') === 0) {
      localStorage.setItem('locale', 'en');
    } else {
      localStorage.setItem('locale', 'de');
    }
    location.reload();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
