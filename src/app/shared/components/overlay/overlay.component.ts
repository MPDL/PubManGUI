import { Component, OnInit, Type } from '@angular/core';
import { OverlayReference } from '../../services/overlay-reference';
import { NgComponentOutlet } from '@angular/common';

@Component({
    selector: 'pure-overlay',
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.scss'],
    standalone: true,
    imports: [NgComponentOutlet]
})
export class OverlayComponent implements OnInit {

  component!: Type<any>;

  constructor(private overlay: OverlayReference) { }

  ngOnInit(): void {
    this.component = this.overlay.component;
  }

  close() {
    this.overlay.close(null);
  }

}
