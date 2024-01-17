import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pure-actions',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>actions works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent { }
