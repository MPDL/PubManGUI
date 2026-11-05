import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';

import { AaService } from '../../../../services/aa.service';
import { CartService } from '../../../../services/cart.service';
import { BatchNavComponent } from '../../../batch/batch-nav/batch-nav.component';
import { ImportsNavComponent } from '../../../imports/imports-nav/imports-nav.component';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-sidenav-options',
  standalone: true,
  imports: [
    RouterLink,
    MatBadgeModule,
    BatchNavComponent,
    ImportsNavComponent,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './sidenav-options.component.html'
})
export class SidenavOptionsComponent {

  aaService = inject(AaService);
  cartService = inject(CartService);

}
