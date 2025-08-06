import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdType } from 'src/app/model/inge';
import {
  AddRemoveButtonsComponent
} from '../../../shared/add-remove-buttons/add-remove-buttons.component';
import { Errors } from 'src/app/model/errors';

@Component({
  selector: 'pure-identifier-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent],
  templateUrl: './identifier-form.component.html',
  styleUrls: ['./identifier-form.component.scss']
})
export class IdentifierFormComponent {

  @Input() identifier_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Input() multi!: boolean;
  @Output() notice = new EventEmitter();

  error_types = Errors;

  identifier_types = Object.keys(IdType);

  identifier_display_types = [
    IdType.ADS,
    IdType.ARXIV,
    IdType.BIBTEX_CITEKEY,
    IdType.BIORXIV,
    IdType.BMC,
    IdType.CHEMRXIV,
    IdType.CONE,
    IdType.DOI,
    IdType.EARTHARXIV,
    IdType.EDARXIV,
    IdType.EDOC,
    IdType.ESS_OPEN_ARCHIVE,
    IdType.ISBN,
    IdType.ISI,
    IdType.ISSN,
    IdType.MEDRXIV,
    IdType.OTHER,
    IdType.PATENT_APPLICATION_NR,
    IdType.PATENT_NR,
    IdType.PATENT_PUBLICATION_NR,
    IdType.PII,
    IdType.PMC,
    IdType.PMID,
    IdType.PND,
    IdType.PSYARXIV,
    IdType.REPORT_NR,
    IdType.RESEARCH_SQUARE,
    IdType.SOCARXIV,
    IdType.SSRN,
    IdType.URI,
    IdType.URN,
    IdType.ZDB
  ]

  add_remove_identifier(event: any) {
    this.notice.emit(event);
  }
}
