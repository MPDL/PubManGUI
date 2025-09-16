import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FundingInfoVO, FundingProgramVO, IdentifierVO, IdType } from 'src/app/model/inge';
import { AddRemoveButtonsComponent } from 'src/app/components/shared/add-remove-buttons/add-remove-buttons.component';
import { Subscription, tap } from 'rxjs';
import { ControlType, FormBuilderService } from '../../../services/form-builder.service';
import { TranslatePipe } from "@ngx-translate/core";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";
import { ConeAutosuggestComponent } from "../../shared/cone-autosuggest/cone-autosuggest.component";
import { ConeService } from "../../../services/cone.service";

@Component({
  selector: 'pure-project-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent, TranslatePipe, BootstrapValidationDirective, ConeAutosuggestComponent],
  templateUrl: './project-info-form.component.html',
  styleUrl: './project-info-form.component.scss'
})
export class ProjectInfoFormComponent {
  @Input() project_info_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Input() multi!: boolean;
  @Output() notice = new EventEmitter();

  @ViewChild('fundingOrgAutosuggest') fundingOrgAutosuggestComponent!: ConeAutosuggestComponent;

  fbs = inject(FormBuilderService);
  coneService = inject(ConeService);

  private grantIdentiferSubscription: Subscription | undefined;
  private fundingOrganizationIdentifierSubscription: Subscription | undefined;
  private fundingProgramIdentifierSubscription: Subscription | undefined;

  ngOnInit(): void {
    if (this.fundingProgramIdentifiers.length < 1) {
      this.fundingProgramIdentifiers.push(this.fbs.identifier_FG(null));
    }
    if (this.fundingOrganizationIdentifiers.length < 1) {
      this.fundingOrganizationIdentifiers.push(this.fbs.identifier_FG(null));
    }
    this.grantIdentiferSubscription = this.project_info_form.get('grantIdentifier')?.get('id')?.valueChanges.subscribe(
      idValue => idValue ? this.project_info_form.get('grantIdentifier')?.get('type')?.patchValue(IdType.GRANT_ID) : this.project_info_form.get('grantIdentifier')?.get('type')?.patchValue(null)
    );
    this.fundingOrganizationIdentifierSubscription = this.fundingOrganizationIdentifier?.get('id')?.valueChanges.subscribe(
      idValue => idValue ? this.fundingOrganizationIdentifier?.get('type')?.patchValue(IdType.OPEN_AIRE) : this.fundingOrganizationIdentifier?.get('type')?.patchValue(undefined)
    );
    this.fundingProgramIdentifierSubscription = this.fundingProgramIdentifier?.get('id')?.valueChanges.subscribe(
      idValue => idValue ? this.fundingProgramIdentifier?.get('type')?.patchValue(IdType.OPEN_AIRE) : this.fundingProgramIdentifier?.get('type')?.patchValue(undefined)
    );
  }


  get fundingInfo() {
    return this.project_info_form.get('fundingInfo') as FormGroup<ControlType<FundingInfoVO>>;
  }

  get grantIdentifier() {
    return this.project_info_form.get('grantIdentifier') as FormGroup<ControlType<IdentifierVO>>;
  }

  get fundingOrganization() {
    return this.fundingInfo?.get('fundingOrganization') as FormGroup<ControlType<FundingProgramVO>>;
  }

  get fundingOrganizationIdentifiers() {
    return this.fundingOrganization?.get('identifiers') as FormArray<FormGroup<ControlType<IdentifierVO>>>;
  }

  get fundingOrganizationIdentifier() {
    return this.fundingOrganizationIdentifiers.at(0) as FormGroup<ControlType<IdentifierVO>>;
  }

  get fundingProgram() {
    return this.fundingInfo?.get('fundingProgram') as FormGroup<ControlType<FundingProgramVO>>;
  }

  get fundingProgramIdentifiers() {
    return this.fundingProgram?.get('identifiers') as FormArray<FormGroup<ControlType<IdentifierVO>>>;
  }

  get fundingProgramIdentifier() {
    return this.fundingProgramIdentifiers.at(0) as FormGroup<ControlType<IdentifierVO>>;
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

  ngOnDestroy(): void {
    this.grantIdentiferSubscription?.unsubscribe();
    this.fundingOrganizationIdentifierSubscription?.unsubscribe();
    this.fundingProgramIdentifierSubscription?.unsubscribe();
  }

  fundingProgramConeSelected($event: any) {
    if ($event) {
      this.coneService.getConeResource($event.parsedId).pipe(
        tap(data => {
          this.fundingProgram.get('title')?.setValue(data.http_purl_org_dc_elements_1_1_title);
          if(data.http_purl_org_dc_elements_1_1_identifier) {
            this.fundingProgramIdentifier.setValue({
              id: data.http_purl_org_dc_elements_1_1_identifier,
              type: IdType.GRANT_ID
            });
          }
          if(data.http_purl_org_dc_elements_1_1_relation) {
            const orgData = data.http_purl_org_dc_elements_1_1_relation;
            this.fundingOrganization.get('title')?.setValue(orgData.http_purl_org_dc_elements_1_1_title);
            if(orgData.http_purl_org_dc_elements_1_1_identifier) {
              this.fundingOrganizationIdentifier.setValue({
                id: orgData.http_purl_org_dc_elements_1_1_identifier,
                type: IdType.GRANT_ID
              });
              this.fundingOrgAutosuggestComponent.selected = true;
            }
          }
        }),
      )
      .subscribe();
    }
    else {
      this.fundingProgram.get('title')?.setValue('');
      this.fundingProgramIdentifier.setValue(this.fbs.identifier_FG(null).value);
      this.fundingOrganization.get('title')?.setValue('');
      this.fundingOrganizationIdentifier.setValue(this.fbs.identifier_FG(null).value);
      this.fundingOrgAutosuggestComponent.selected = false;
    }

  }

  fundingOrganizationConeSelected($event: any) {
    if ($event) {
      this.coneService.getConeResource($event.parsedId).pipe(
        tap(data => {
          this.fundingOrganization.get('title')?.setValue(data.http_purl_org_dc_elements_1_1_title);
          if(data.http_purl_org_dc_elements_1_1_identifier) {
            this.fundingOrganizationIdentifier.setValue({
              id: data.http_purl_org_dc_elements_1_1_identifier,
              type: IdType.GRANT_ID
            });
          }
        }),
      )
        .subscribe();
    }
    else {
      this.fundingOrganization.get('title')?.setValue('');
      this.fundingOrganizationIdentifier.setValue(this.fbs.identifier_FG(null).value);
    }

  }
}
