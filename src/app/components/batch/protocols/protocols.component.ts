import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

@Component({
  selector: 'pure-protocols',
  standalone: true,
  imports: [
    CommonModule,
    BatchNavComponent,
  ],
  templateUrl: './protocols.component.html'
})
export class ProtocolsComponent { }
