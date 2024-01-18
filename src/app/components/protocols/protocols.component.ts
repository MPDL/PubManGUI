import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pure-protocols',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>protocols works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtocolsComponent { }
