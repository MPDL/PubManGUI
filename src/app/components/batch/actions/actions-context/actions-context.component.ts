import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContextDbRO } from 'src/app/model/inge';
import { PureCtxsDirective } from 'src/app/shared/components/selector/services/pure_ctxs/pure-ctxs.directive';
import { ControlType } from "../../../item-edit/services/form-builder.service";
import { OptionDirective } from "../../../../shared/components/selector/directives/option.directive";
import { SelectorComponent } from "../../../../shared/components/selector/selector.component";

@Component({
  selector: 'pure-actions-context',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PureCtxsDirective,
    OptionDirective,
    SelectorComponent
  ],
  templateUrl: './actions-context.component.html',
})
export class ActionsContextComponent {

  constructor(private fb: FormBuilder) { }

  // changeContext(List<String> itemIds, String contextFrom, String contextTo, String userId, String token);
  public changeContextForm: FormGroup = this.fb.group({
    contextFrom: this.fb.group<ControlType<ContextDbRO>>({
      objectId: this.fb.control(''),
      name: this.fb.control('')
    }),
    contextTo: this.fb.group<ControlType<ContextDbRO>>({
      objectId: this.fb.control(''),
      name: this.fb.control('')
    }),
  });

  get contextFrom() {
    return this.changeContextForm.get('contextFrom') as FormGroup<ControlType<ContextDbRO>>;
  }

  get contextTo() {
    return this.changeContextForm.get('contextTo') as FormGroup<ControlType<ContextDbRO>>;
  }

  updateContextFrom(event: any) {
    this.contextFrom.patchValue({ objectId: event.id }, { emitEvent: false });
  }

  updateContextTo(event: any) {
    this.contextTo.patchValue({ objectId: event.id }, { emitEvent: false });
  }

  // TO-DO
  onSubmit(): void {
    if (this.changeContextForm.invalid) {
      this.changeContextForm.markAllAsTouched();
      return;
    }

    console.log(this.changeContextForm.value);
  }
}


