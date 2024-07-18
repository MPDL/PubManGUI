import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO } from 'src/app/model/inge';
import { PureCtxsDirective } from 'src/app/shared/components/selector/services/pure_ctxs/pure-ctxs.directive';
import { OptionDirective } from "src/app/shared/components/selector/directives/option.directive";
import { SelectorComponent } from "src/app/shared/components/selector/selector.component";

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeContextParams } from 'src/app/components/batch/interfaces/actions-params';
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

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService, 
    private aaSvc: AaService, 
    private batchSvc: BatchService,
    private router: Router) { }

  user_contexts?: ContextDbRO[] = [];

  ngOnInit(): void {
    this.aaSvc.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    )
  }

  public changeContextForm: FormGroup = this.fb.group({
    /*
    contextFrom: [this.fb.group<ControlType<ContextDbRO>>,[ Validators.required ]],
    contextTo: [this.fb.group<ControlType<ContextDbRO>>,[ Validators.required ]]
    */
    contextFrom: ['Context',[ Validators.required ]],
    contextTo: ['Context',[ Validators.required ]]
  }, 
  //{ validators: this.validSvc.notEqualsValidator('contextFrom','contextTo') }
  );

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
    this.batchSvc.changeContext(this.changeContextParams).subscribe(actionResponse => {
      // console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      setTimeout(() => {this.changeContextForm.reset();}, 500);
      this.router.navigate(['/batch']);
    });
  }

}