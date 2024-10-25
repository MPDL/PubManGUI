import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import FetchComponent  from './fetch/fetch.component';
import ImportComponent  from './import/import.component';

@Component({
  selector: 'pure-imports-new',
  standalone: true,
  imports: [
    CommonModule,
    FetchComponent,
    ImportComponent
  ],
  templateUrl: './new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewComponent { }
