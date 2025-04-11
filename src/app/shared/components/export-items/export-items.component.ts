import {Component, Input} from '@angular/core';
import {DefaultKeyValuePipe} from "../../services/pipes/default-key-value.pipe";
import {citationTypes, exportTypes, ItemVersionVO} from "../../../model/inge";
import {FormBuilder, FormControl, FormGroup, FormsModule} from "@angular/forms";
import {ItemsService} from "../../../services/pubman-rest-client/items.service";
import {AaService} from "../../../services/aa.service";
import {OuAutosuggestComponent} from "../ou-autosuggest/ou-autosuggest.component";
import {CslAutosuggestComponent} from "../csl-autosuggest/csl-autosuggest.component";
import {SanitizeHtmlPipe} from "../../services/pipes/sanitize-html.pipe";
import { environment } from 'src/environments/environment';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-export-items',
  standalone: true,
  imports: [
    DefaultKeyValuePipe,
    FormsModule,
    OuAutosuggestComponent,
    CslAutosuggestComponent,
    SanitizeHtmlPipe
  ],
  templateUrl: './export-items.component.html',
  styleUrl: './export-items.component.scss'
})
export class ExportItemsComponent {

  @Input() itemIds: string[] = [];
  @Input() item: ItemVersionVO|undefined = undefined;


  protected readonly exportTypes = exportTypes;
  protected readonly citationTypes = citationTypes;

  protected restUri = environment.inge_rest_uri;

  selectedExportType:string = exportTypes.ENDNOTE;
  selectedCitationType:string = citationTypes.APA;
  selectedCslId = '';

  currentCitation: string = '';

  constructor(private itemService: ItemsService, protected activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.loadCitation();
  }

  loadCitation() {
    if(!this.isFormat && (this.selectedCitationType !== citationTypes.CSL || this.selectedCslId)) {
      this.itemService.retrieveSingleCitation(this.item?.objectId + '_' + this.item?.versionNumber, this.selectedCitationType, this.selectedCslId).subscribe(
        cit => {
          //console.log('Citation: ' +cit)
          this.currentCitation=cit;
        }
      )
    }

  }
  handleFormatChange($event: Event) {
    this.currentCitation = '';
    this.loadCitation();
    console.log(this.selectedExportType)
  }

  handleCitationChange($event: Event) {
    this.currentCitation = '';
    this.loadCitation();
    console.log(this.selectedExportType)
  }

  selectCsl(event: any) {
    console.log(event);
    this.selectedCslId = event.id;
    console.log(event.id);
    if(this.selectedCslId)
      this.loadCitation();
    else
      this.currentCitation = '';
  }

  get isFormat() {
    return this.selectedExportType === exportTypes.ENDNOTE ||
      this.selectedExportType === exportTypes.BIBTEX ||
      this.selectedExportType === exportTypes.JSON ||
      this.selectedExportType === exportTypes.ESCIDOC_ITEMLIST_XML ||
      this.selectedExportType === exportTypes.MARC_XML;

  }

  get downloadLink() {
    return this.restUri + '/items/' + this.item?.objectId + '_' +this.item?.versionNumber
      + '/export?format=' + this.selectedExportType
      + (this.selectedCitationType ? '&citation=' + this.selectedCitationType : '')
      + (this.selectedCslId ? '&cslConeId=' + this.selectedCslId : '')
  }
}
