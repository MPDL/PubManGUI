import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
  ViewChild
} from '@angular/core';

import { TranslatePipe } from "@ngx-translate/core";

import { SidenavOptionsComponent } from './sidenav-options/sidenav-options.component';

@Component({
  selector: 'pure-sidenav',
  standalone: true,
  imports: [
    TranslatePipe,
    SidenavOptionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent {

  @ViewChild('sidenav', { read: ElementRef }) nav!: ElementRef;
  renderer = inject(Renderer2);

  expand() {
    this.renderer.removeClass(this.nav.nativeElement, 'collapsed');
  }

  collapse() {
    this.renderer.addClass(this.nav.nativeElement, 'collapsed');
  }

}
