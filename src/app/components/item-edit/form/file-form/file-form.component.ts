import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContentCategories, MdsFileVO, OA_STATUS, Visibility } from 'src/app/model/inge';
import { ControlType } from '../../services/form-builder.service';
import { IpEntry, MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import { AddRemoveButtonsComponent } from 'src/app/shared/components/add-remove-buttons/add-remove-buttons.component';
import { AaService } from 'src/app/services/aa.service';
import { CdkDragHandle, CdkDragPreview, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'pure-file-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    CommonModule,
    ReactiveFormsModule,
    CdkDragHandle,
    CdkDragPreview,
    CdkDragPlaceholder,
  ],
  templateUrl: './file-form.component.html',
  styleUrl: './file-form.component.scss'
})
export class FileFormComponent {
  @Input() file_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();

  contentCategory_types = Object.keys(ContentCategories).map(key => key.replaceAll('_', '-'));
  visibility_types = Object.keys(Visibility);
  oaStatus_types = Object.keys(OA_STATUS);

  ipRangeCompleteList: IpEntry[] = [] as IpEntry[];

  constructor(miscellaneousService: MiscellaneousService, aaService: AaService) {
    miscellaneousService.retrieveIpList().subscribe(
      result => { this.ipRangeCompleteList = result; console.log('Miscellaneous IPList: ', this.ipRangeCompleteList) }
    )
    console.log("Complete IPList", JSON.stringify(this.ipRangeCompleteList))
  }



  get metadata() {
    return this.file_form.get('metadata') as FormGroup<ControlType<MdsFileVO>>;
  }

  get allowedAudienceIds() {
    //console.log('Allowed Audiences: ', this.file_form.get('allowedAudienceIds'));
    return this.file_form.get('allowedAudienceIds') as FormArray<FormControl>;
  }

  contentCategory_change(event: any) {
    this.metadata.get('contentCategory')?.setValue(event.target.value.replaceAll('-', '_'))
    console.log('changed content category', event.target.value)
  }

  visibility_change(event: any) {
    console.log('changed visibility', event.target.value)
  }

  allowedAudienceIds_change(event: any) {
    console.log('changed visibility', event.target.value)
  }

  handleAllowedAudienceIdsNotification(event: any) {
    if (event.action === 'add') {
      this.addAllowedAudienceId(event.index);
    } else if (event.action === 'remove') {
      this.removeAllowedAudienceIds(event.index);
    }
  }

  addAllowedAudienceId(index: number) {
    this.allowedAudienceIds.insert(index + 1, {} as FormControl);
  }

  removeAllowedAudienceIds(index: number) {
    this.allowedAudienceIds.removeAt(index);
  }
}
