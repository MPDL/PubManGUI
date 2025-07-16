import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'pure-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [TranslatePipe]
})
export class FooterComponent {
  protected linkDisclaimer: string = 'disclaimer';
  protected linkPrivacy: string = 'privacy-policy';
  protected linkCookies: string = "";
  protected linkPubman: string = 'https://pure.mpg.de/';
  protected linkHome: string = 'home';

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
