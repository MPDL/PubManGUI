import { Component } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [TranslatePipe]
})
export class FooterComponent {
  protected linkImpressum: string = "";
  protected linkDatenschutz: string = "";
  protected linkCookies: string = "";
  protected linkPubman: string = "";
  protected linkHomepage: string = "";

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
