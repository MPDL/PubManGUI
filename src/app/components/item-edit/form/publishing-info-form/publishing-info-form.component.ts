import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-publishing-info-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './publishing-info-form.component.html',
  styleUrl: './publishing-info-form.component.scss'
})
export class PublishingInfoFormComponent {
  @Input() publishing_info_form!: FormGroup;
}
