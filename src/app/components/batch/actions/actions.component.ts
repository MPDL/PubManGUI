import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-actions',
  standalone: true,
  imports: [
    CommonModule,
    BatchNavComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './actions.component.html'
})
export class ActionsComponent { }
