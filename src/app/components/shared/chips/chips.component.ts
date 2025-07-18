import { Component, Input } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatIconModule } from '@angular/material/icon';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-chips',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatChipsModule, MatIconModule, TranslatePipe],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss'
})
export class ChipsComponent {

  @Input() form!: FormGroup;
  @Input() control_name!: string;
  @Input() chips!: string[]

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      if (this.chips.indexOf(value) < 0) {
        this.chips.push(value);
      }
    }

    event.chipInput!.clear();
  }

  remove(chip: string): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }

  edit(chip: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(chip);
      return;
    }

    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips[index] = value;
    }
  }
}
