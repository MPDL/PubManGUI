import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-publishing-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './publishing-info-form.component.html',
  styleUrl: './publishing-info-form.component.scss'
})
export class PublishingInfoFormComponent {
  @Input() publishing_info_form!: FormGroup;
}
