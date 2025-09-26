import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollToTopComponent } from './components/shared/scroll-to-top/scroll-to-top.component';
import { InfoSubheaderComponent } from "./components/shared/info-subheader/info-subheader.component";

import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NgbTooltipConfig } from "@ng-bootstrap/ng-bootstrap";
import { filter } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { AaService } from "./services/aa.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SidenavComponent, ScrollToTopComponent, InfoSubheaderComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  defaultTitle = 'MPG.PuRe';

  constructor(
    tooltipConfig: NgbTooltipConfig,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private translate: TranslateService,
    private aaService: AaService
  )
  {
    // Check login every time the focus is on the window, e.g. if a user has logged in/out in another tab or admin tool
    window.onfocus = function() {
      aaService.checkLoginChanged();
    };

    //Set HTML title to the breadcrumb label
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
      )
      .subscribe(event => {
        const titles = this.getNestedRouteTitles();
        titles.push(this.defaultTitle);
        this.title.setTitle(titles.join(' | '));
    })

    tooltipConfig.container = 'body';

  }

  getNestedRouteTitles(): string[] {
    let currentRoute = this.router.routerState.root.firstChild;
    const titles: string[] = [];

    while (currentRoute) {
      const labelKey = currentRoute.snapshot.data['breadcrumb'].labelKey;
      if (labelKey) {
        titles.push(this.translate.instant(labelKey));
      }

      currentRoute = currentRoute.firstChild;
    }

    return titles;
  }
}
