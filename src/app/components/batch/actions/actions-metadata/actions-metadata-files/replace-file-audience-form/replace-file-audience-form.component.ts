import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, ValidatorFn, FormControl, ReactiveFormsModule } from '@angular/forms';


import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ReplaceFileAudienceParams } from 'src/app/components/batch/interfaces/actions-params';
import { ipList }  from 'src/app/components/batch/interfaces/actions-responses';

@Component({
  selector: 'pure-replace-file-audience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './replace-file-audience-form.component.html',
})
export class ReplaceFileAudienceFormComponent implements OnInit {

  ous: ipList[] = [];

  constructor(private fb: FormBuilder, public vs: ValidatorsService, private bs: BatchService) { }

  ngOnInit(): void {
    this.bs.getIpList()
      .subscribe( ous => this.ous = ous );
  }

  public replaceFileAudienceForm: FormGroup = this.fb.group({
    allowedAudienceIds: this.fb.array([])
  });

  public audienceId: FormControl = new FormControl('', [Validators.required, Validators.minLength(1), this.vs.notBeOnValidator( this.replaceFileAudienceForm.controls['allowedAudienceIds'] )] );

  get replaceFileAudienceParams(): ReplaceFileAudienceParams {
    const actionParams: ReplaceFileAudienceParams = {
      allowedAudienceIds: this.getIDsOfAudience(),
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.replaceFileAudienceForm.invalid) {
      this.replaceFileAudienceForm.markAllAsTouched();
      return;
    }

    this.bs.replaceFileAudience(this.replaceFileAudienceParams).subscribe( actionResponse => console.log(actionResponse) );
  }

  get AudiencesToAdd() {
    return this.replaceFileAudienceForm.get('allowedAudienceIds') as FormArray;
  }

  onAddToNewAudiences(): void {
    /*
    const range = this.audienceId.value;
    const added = this.AudiencesToAdd.controls.map(control => control.value);
    const hasDuplicate = added.indexOf(range) != -1;
    this.audienceId.setErrors( hasDuplicate ? { 'duplicated': true } : null);
    */
    if (this.audienceId.invalid) return;

    this.AudiencesToAdd.push(
      this.fb.control(this.audienceId.value, Validators.required)
    );

    this.audienceId.reset();
  }

  onDeleteAudience(index: number): void {
    this.AudiencesToAdd.removeAt(index);
  }

  getIDsOfAudience(): string[] {
    let Audiences = [];

    for (let range of this.AudiencesToAdd.controls) {
      Audiences.push(this.ous.find(x => x.name === range.value)!.id);
    }

    return Audiences;
  }

}