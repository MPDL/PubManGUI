import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {FileSectionSearchCriterion} from "../criterions/FileSectionSearchCriterion";


@Component({
  selector: 'pure-file-section-component',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './file-section-component.component.html',
  styleUrl: './file-section-component.component.scss'
})
export class FileSectionComponent {

  @Input() fileSectionSearchCriterion!: FileSectionSearchCriterion;

}
