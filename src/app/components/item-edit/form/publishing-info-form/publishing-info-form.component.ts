import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';

@Component({
  selector: 'pure-publishing-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './publishing-info-form.component.html',
  styleUrl: './publishing-info-form.component.scss'
})
export class PublishingInfoFormComponent {
  @Input() publishing_info_form!: FormGroup;

  miscellaneousService = inject(MiscellaneousService);

  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }
}
