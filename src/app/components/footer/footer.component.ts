import { Component } from '@angular/core';

// requires "resolveJsonModule": true in tsconfig.json
import packageJson from '../../../../package.json';

@Component({
    selector: 'pure-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true
})
export class FooterComponent {

  name = packageJson.name;
  version = packageJson.version;
  home = 'https://github.com/MPDL/PubManGui#readme';
  author = 'MPDL';
  angular_uri = 'https://angular.io';
  node_uri = 'https://nodejs.org';
  bootstrap_uri = 'https://getbootstrap.com';

}