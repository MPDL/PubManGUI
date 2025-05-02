import {Component, Input, ViewChild, ViewChildren} from '@angular/core';
import {DefaultKeyValuePipe} from "../../services/pipes/default-key-value.pipe";
import {citationTypes, exportTypes, ItemVersionVO} from "../../../model/inge";
import {FormBuilder, FormControl, FormGroup, FormsModule} from "@angular/forms";
import {ItemsService} from "../../../services/pubman-rest-client/items.service";
import {AaService} from "../../../services/aa.service";
import {OuAutosuggestComponent} from "../ou-autosuggest/ou-autosuggest.component";
import {CslAutosuggestComponent} from "../csl-autosuggest/csl-autosuggest.component";
import {SanitizeHtmlPipe} from "../../services/pipes/sanitize-html.pipe";
import {environment} from 'src/environments/environment';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ItemSelectionService} from "../../services/item-selection.service";
import {map} from "rxjs";
import {baseElasticSearchQueryBuilder} from "../../services/search-utils";
import {LoadingComponent} from "../loading/loading.component";
import {contentDispositionParser} from "../../services/utils";


@Component({
  selector: 'pure-export-items',
  standalone: true,
  imports: [
    DefaultKeyValuePipe,
    FormsModule,
    OuAutosuggestComponent,
    CslAutosuggestComponent,
    SanitizeHtmlPipe,
    LoadingComponent
  ],
  templateUrl: './export-items.component.html',
  styleUrl: './export-items.component.scss'
})
export class ExportItemsComponent {

  //@Input() itemIds: string[] = [];
  //@Input() item: ItemVersionVO|undefined = undefined;

  @Input() sortQuery: any;
  //@ViewChildren(CslAutosuggestComponent) cslAutosuggestComponent!: CslAutosuggestComponent;

  protected readonly exportTypes = exportTypes;
  protected readonly citationTypes = citationTypes;

  protected restUri = environment.inge_rest_uri;

  itemIds: string[] = [];

  selectedExportType: string = exportTypes.ENDNOTE;
  selectedCitationType: string = citationTypes.APA;
  selectedCslId = "";
  selectedCslName = "";

  currentCitation: string = '';

  protected loading = false;
  protected errorMessage: string = "";

  constructor(private itemService: ItemsService, protected activeModal: NgbActiveModal, private selectionService: ItemSelectionService) {
  }

  ngOnInit() {

    const exportType = localStorage.getItem("exportType");
    if (exportType) {
      const expType: ExportType = JSON.parse(exportType);
      this.selectedExportType = expType.exportType;
      this.selectedCitationType = expType.citationType;
      this.selectedCslId = expType.cslId;
      this.selectedCslId = expType.cslId;
      this.selectedCslName = expType.cslName;
    }

    this.itemIds = this.selectionService.selectedIds$.value;
    this.loadCitation();
  }

  updateStoredExportInfo() {
    this.errorMessage = "";
    const exportType: ExportType = {
      exportType: this.selectedExportType,
      citationType: this.selectedCitationType,
      cslId: this.selectedCslId,
      cslName: this.selectedCslName,
    }
    localStorage.setItem("exportType", JSON.stringify(exportType));
  }

  loadCitation() {
    if (!this.isFormat && this.isValid()) {
      this.itemService.retrieveSingleCitation(this.itemIds[0], this.selectedCitationType, this.selectedCslId).subscribe({
        next: (cit) => {
          //console.log('Citation: ' +cit)
          this.currentCitation = cit;
        },
        error: e => {
          this.errorMessage = e;
          this.loading = false;
        },
      })
    }

  }

  isValid(): boolean {
    return this.itemIds.length > 0 &&
      (this.selectedCitationType !== citationTypes.CSL || (this.selectedCslId?.length > 0));
  }

  handleFormatChange($event: Event) {
    this.currentCitation = '';
    this.loadCitation();
    this.updateStoredExportInfo();
  }

  handleCitationChange($event: Event) {
    this.currentCitation = '';
    this.loadCitation();
    this.updateStoredExportInfo();
  }

  selectCsl(event: any) {
    this.selectedCslId = event.id;
    this.selectedCslName = event.value;
    if (this.selectedCslId)
      this.loadCitation();
    else {
      this.currentCitation = '';
    }

    this.updateStoredExportInfo();
  }

  get isFormat() {
    return this.selectedExportType === exportTypes.ENDNOTE ||
      this.selectedExportType === exportTypes.BIBTEX ||
      this.selectedExportType === exportTypes.JSON ||
      this.selectedExportType === exportTypes.ESCIDOC_ITEMLIST_XML ||
      this.selectedExportType === exportTypes.MARC_XML;

  }

  get downloadLink() {
    return this.restUri + '/items/' + this.itemIds[0]
      + '/export?format=' + this.selectedExportType
      + (this.selectedCitationType ? '&citation=' + this.selectedCitationType : '')
      + (this.selectedCslId ? '&cslConeId=' + this.selectedCslId : '')
  }

  download() {
    this.loading = true;
    const searchQuery = {
      query: baseElasticSearchQueryBuilder("objectId", this.itemIds),
      size: this.itemIds.length,
      ...this.sortQuery && {sort: [this.sortQuery]},
    }

    this.itemService.searchAndExport(searchQuery, this.selectedExportType, this.selectedCitationType, this.selectedCitationType === citationTypes.CSL ? this.selectedCslId : undefined, true).subscribe({
      next: result => {
        if (result.body) {
          const blob: Blob = result.body;
          console.log("Blob type: " + blob.type);
          const data = window.URL.createObjectURL(blob);
          let filename = "download"


          const contentDispositionHeader = result.headers.get("Content-disposition");
          const parsedContentDisposition = contentDispositionParser(contentDispositionHeader)
          if (parsedContentDisposition) {
            const parsedFileName = parsedContentDisposition['filename']
            if(parsedFileName) {
              filename = parsedFileName;
            }
          }
          const link = document.createElement('a');
          link.href = data;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(data);
          link.remove();
          this.loading = false;
        }
      },
      error: e => {
        this.errorMessage = e;
        this.loading = false;
      },
    })
  }
}

export interface ExportType {
  exportType: string;
  citationType: string;
  cslId: string;
  cslName: string;

}
