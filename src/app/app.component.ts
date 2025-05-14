import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from './shared/services/navigation.service';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollToTopComponent } from './shared/components/scroll-to-top/scroll-to-top.component';
import { InfoPanelComponent } from "./shared/components/info-panel/info-panel.component";

import { TranslateModule } from "@ngx-translate/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SidenavComponent, ScrollToTopComponent, InfoPanelComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pure';

  constructor(
    private navigation: NavigationService,

  ) {

   }
}
