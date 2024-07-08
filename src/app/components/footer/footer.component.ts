import { Component } from '@angular/core';

@Component({
  selector: 'pure-footer',
  templateUrl: './footer.component.html',
  standalone: true
})
export class FooterComponent {
  protected linkImpressum: string = "";
  protected linkDatenschutz: string = "";
  protected linkCookies: string = "";
  protected linkPubman: string = "";
  protected linkHomepage: string = "";

  openLink(url: string){
    window.open(url, '_blank');
  }
}
