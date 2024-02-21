import { Component, EventEmitter, Input, Output, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentifierFormComponent } from '../identifier-form/identifier-form.component';import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { FundingInfoVO, FundingProgramVO, IdentifierVO } from 'src/app/model/inge';
import { AddRemoveButtonsComponent } from '../add-remove-buttons/add-remove-buttons.component';

@Component({
  selector: 'pure-project-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent, IdentifierFormComponent],
  templateUrl: './project-info-form.component.html',
  styleUrl: './project-info-form.component.scss'
})
export class ProjectInfoFormComponent {
  @Input() project_info_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Input() multi!: boolean;
  @Output() notice = new EventEmitter();

  fbs = inject(FormBuilderService);

  get fundingInfo() {
    return this.project_info_form.get('fundingInfo') as FormGroup<ControlType<FundingInfoVO>>;
  }

  get grantIdentifier() {
    return this.project_info_form.get('grantIdentifier') as FormGroup<ControlType<IdentifierVO>>;
  }

  get fundingOrganization() {
    return this.project_info_form.get('fundingInfo')?.get('fundingOrganization') as FormGroup<ControlType<FundingProgramVO>>;
  }
  get fundingOrganizationIdentifiers() {
    return this.project_info_form.get('fundingInfo')?.get('fundingOrganization')?.get('identifiers') as FormArray<FormGroup<ControlType<IdentifierVO>>>;
  }

  get fundingProgram() {
    return this.project_info_form.get('fundingInfo')?.get('fundingProgram') as FormGroup<ControlType<FundingProgramVO>>;
  }

  get fundingProgramIdentifiers() {
    return this.project_info_form.get('fundingInfo')?.get('fundingProgram')?.get('identifiers') as FormArray<FormGroup<ControlType<IdentifierVO>>>;
  }

  add_remove_projectInfo(event: any) {
    this.notice.emit(event);
  }

  handleFundingOrganizationIdentifierNotification(event: any) {
    if (event.action === 'add') {
      this.addFundingOrganizationIdentifier(event.index);
    } else if (event.action === 'remove') {
      this.removeFundingOrganizationIdentifier(event.index);
    }
  }

  handleNoFundingOrganizationIdentifiers() {
    this.fundingOrganizationIdentifiers.push(this.fbs.identifier_FG(null));
  }

  addFundingOrganizationIdentifier(index: number) {
    this.fundingOrganizationIdentifiers.insert( index + 1, this.fbs.identifier_FG(null));
  }

  removeFundingOrganizationIdentifier(index: number) {
    this.fundingOrganizationIdentifiers.removeAt(index);
  }

  

  handleFundingProgramIdentifierNotification(event: any) {
    if (event.action === 'add') {
      this.addFundingProgramIdentifier(event.index);
    } else if (event.action === 'remove') {
      this.removeFundingProgramIdentifier(event.index);
    }
  }

  handleNoFundingProgramIdentifiers() {
    this.fundingProgramIdentifiers.push(this.fbs.identifier_FG(null));
  }

  addFundingProgramIdentifier(index: number) {
    this.fundingProgramIdentifiers.insert( index + 1, this.fbs.identifier_FG(null));
  }

  removeFundingProgramIdentifier(index: number) {
    this.fundingProgramIdentifiers.removeAt(index);
  }
}
