import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {FileSectionSearchCriterion} from "../criterions/FileSectionSearchCriterion";
import {TranslatePipe} from "@ngx-translate/core";


@Component({
  selector: 'pure-file-section-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './file-section-component.component.html',
  styleUrl: './file-section-component.component.scss'
})
export class FileSectionComponent {

  @Input() fileSectionSearchCriterion!: FileSectionSearchCriterion;

}
