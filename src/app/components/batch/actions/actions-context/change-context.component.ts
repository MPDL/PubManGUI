import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContextDbRO, ContextDbVO } from 'src/app/model/inge';
import { PureCtxsDirective } from 'src/app/shared/components/selector/services/pure_ctxs/pure-ctxs.directive';
import { ControlType } from "src/app/components/item-edit/services/form-builder.service";
import { OptionDirective } from "src/app/shared/components/selector/directives/option.directive";
import { SelectorComponent } from "src/app/shared/components/selector/selector.component";

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeContextParams } from 'src/app/components/batch/interfaces/actions-params';
import { AaService } from 'src/app/services/aa.service';


@Component({
  selector: 'pure-batch-change-context',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PureCtxsDirective,
    OptionDirective,
    SelectorComponent
  ],
  templateUrl: './change-context.component.html',
})
export class ActionsContextComponent {

  constructor(private fb: FormBuilder, public vs: ValidatorsService, private aaSvc: AaService, private bs: BatchService) { }

  user_contexts?: ContextDbRO[];

  ngOnInit(): void {
    this.aaSvc.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    )
  }

  public changeContextForm: FormGroup = this.fb.group({
    contextFrom: this.fb.group<ControlType<ContextDbVO>>,
    contextTo: this.fb.group<ControlType<ContextDbVO>>
  });

  get changeContextParams(): ChangeContextParams {
    const actionParams: ChangeContextParams = {
      contextFrom: this.changeContextForm.controls['contextFrom'].value,
      contextTo: this.changeContextForm.controls['contextTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeContextForm.invalid) {
      this.changeContextForm.markAllAsTouched();
      return;
    }
    this.bs.changeContext(this.changeContextParams).subscribe(actionResponse => console.log(actionResponse));
  }

}