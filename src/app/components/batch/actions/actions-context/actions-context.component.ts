import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContextDbRO } from 'src/app/model/inge';
import { PureCtxsDirective } from 'src/app/shared/components/selector/services/pure_ctxs/pure-ctxs.directive';
import { ControlType } from "../../../item-edit/services/form-builder.service";
import { OptionDirective } from "../../../../shared/components/selector/directives/option.directive";
import { SelectorComponent } from "../../../../shared/components/selector/selector.component";

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeContextParams } from 'src/app/components/batch/interfaces/actions-params';


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

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  public changeContextForm: FormGroup = this.fb.group({
    contextFrom: this.fb.group<ControlType<ContextDbRO>>({
      objectId: this.fb.control('', [Validators.required]),
      name: this.fb.control('')
    }),
    contextTo: this.fb.group<ControlType<ContextDbRO>>({
      objectId: this.fb.control('', [Validators.required]),
      name: this.fb.control('')
    }),
  }, { 
    validators: [this.fieldsNotEqual.bind(this)] 
  });

  fieldsNotEqual(formGroup: FormGroup) {
      const from = formGroup.controls['contextFrom'].value.objectId;
      const to = formGroup.controls['contextTo'].value.objectId;
      if (formGroup.controls['contextTo'].dirty) {
        if (from === to) {
          formGroup.controls['contextTo'].setErrors({'fieldsMatch': true});
          return { fieldsMatch: true }
        };
      }
      formGroup.get('contextTo')?.setErrors(null);
      return null;
  }

  get changeContextParams(): ChangeContextParams {
    const actionParams: ChangeContextParams = {
      contextFrom: this.changeContextForm.controls['contextFrom'].value.objectId,
      contextTo: this.changeContextForm.controls['contextTo'].value.objectId,
      itemIds: []
    }
    return actionParams;
  }

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

  onSubmit(): void {
    if (this.changeContextForm.invalid) {
      this.changeContextForm.markAllAsTouched();
      return;
    }

    this.bs.changeContext(this.changeContextParams).subscribe(actionResponse => console.log(actionResponse));
  }

}