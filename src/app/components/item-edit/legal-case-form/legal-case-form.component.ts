import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-legal-case-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './legal-case-form.component.html',
  styleUrl: './legal-case-form.component.scss'
})

export class LegalCaseFormComponent {
  @Input() legal_case_form!: FormGroup;
}
