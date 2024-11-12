import {Component, Input} from '@angular/core';
import {FileDbVO, ItemVersionVO} from "../../../model/inge";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import * as props from "../../../../assets/properties.json";
import {EmptyPipe} from "../../../shared/services/pipes/empty.pipe";
import {AaService} from "../../../services/aa.service";
import {checkFileAccess} from "../../../shared/services/item-utils";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'pure-item-view-file',
  standalone: true,
  imports: [
    NgbTooltip,
    EmptyPipe,
    NgTemplateOutlet
  ],
  templateUrl: './item-view-file.component.html',
  styleUrl: './item-view-file.component.scss'
})
export class ItemViewFileComponent {

  protected ingeUri = props.inge_uri;
  @Input({required: true}) files: FileDbVO[] | undefined = [];
  @Input({required: true}) item!: ItemVersionVO;

  constructor(private aaService: AaService) {
  }

  fileAccessGranted(file: FileDbVO) {
    return checkFileAccess(file, this.item, this.aaService.principal.value);
  }

}
