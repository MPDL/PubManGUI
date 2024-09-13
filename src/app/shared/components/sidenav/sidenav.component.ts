import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {AaService} from "../../../services/aa.service";

import { MatBadgeModule } from '@angular/material/badge';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { BatchNavComponent } from 'src/app/components/batch/batch-nav/batch-nav.component';

@Component({
  selector: 'pure-sidenav',
  standalone: true,
  imports: [RouterLink, MatBadgeModule, CommonModule, BatchNavComponent],
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements AfterViewInit {

  @Input() mobile !: boolean;

  @ViewChild('sidenav', {read: ElementRef}) nav!: ElementRef;
  renderer = inject(Renderer2);

  constructor(protected aaService: AaService, public batchSvc: BatchService) {
  }

  ngAfterViewInit(): void {
    this.collapse();
  }

  /*
  ex_col() {
    const expanded = this.nav.nativeElement.classList.contains('collapsed');
    this.renderer[expanded ? 'removeClass' : 'addClass'](this.nav.nativeElement, 'collapsed');
  }
  */

  expand() {
    this.renderer.removeClass(this.nav.nativeElement, 'collapsed');
  }

  collapse() {
    this.renderer.addClass(this.nav.nativeElement, 'collapsed');
  }

}
