import { Component, Input } from '@angular/core';
import { citationTypes, exportTypes } from "../../../model/inge";
import { FormsModule } from "@angular/forms";
import { ItemsService } from "../../../services/pubman-rest-client/items.service";
import { CslAutosuggestComponent } from "../csl-autosuggest/csl-autosuggest.component";
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemSelectionService } from "../../services/item-selection.service";
import { Subscription } from "rxjs";
import { LoadingComponent } from "../loading/loading.component";
import { contentDispositionParser } from "../../services/utils";
import { TranslatePipe } from "@ngx-translate/core";
import { JsonPipe } from "@angular/common";


@Component({
  selector: 'pure-export-items',
  standalone: true,
  imports: [
    FormsModule,
    CslAutosuggestComponent,
    LoadingComponent,
    TranslatePipe,
    JsonPipe
  ],
  templateUrl: './export-items.component.html',
  styleUrl: './export-items.component.scss'
})
export class ExportItemsComponent {

  //@Input() itemIds: string[] = [];
  //@Input() item: ItemVersionVO|undefined = undefined;

  @Input() sortQuery: any;
  @Input() completeQuery: any;
  @Input() type: 'exportSelected' | 'exportAll' = 'exportSelected';
  //@ViewChildren(CslAutosuggestComponent) cslAutosuggestComponent!: CslAutosuggestComponent;

  protected readonly exportTypes = exportTypes;
  protected readonly citationTypes = citationTypes;

  protected restUri = environment.inge_rest_uri;

  itemIds: string[] = [];

  selectedExportType: string = exportTypes.ENDNOTE;
  selectedCitationType: string = citationTypes.APA;
  selectedCslId = "";
  selectedCslName = "";
  selectedSize = 500;
  selectedFrom = 0;

  currentCitation: string = '';

  protected loading = false;
  protected errorMessage: string = "";
  private exportSubscription?: Subscription;

  protected atomFeedUrl = "";

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

    if(this.type === 'exportSelected') {
      this.itemIds = this.selectionService.selectedIds$.value;
    }


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

  handleSizeChange($event: Event) {
    console.log("handleSizeChange", $event,  this.selectedSize);
    this.completeQuery.size = this.selectedSize;
  }

  handleFromChange($event: Event) {
    this.completeQuery.from = this.selectedFrom;
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

  closeModal() {
    if(this.exportSubscription) {
      this.exportSubscription.unsubscribe();
    }
    this.activeModal.dismiss();
  }

  get downloadLink() {
    return this.restUri + '/items/' + this.itemIds[0]
      + '/export?format=' + this.selectedExportType
      + (this.selectedCitationType ? '&citation=' + this.selectedCitationType : '')
      + (this.selectedCslId ? '&cslConeId=' + this.selectedCslId : '')
  }

  download() {
    this.loading = true;
    let searchQuery: any = {};

    if(this.type === 'exportSelected') {
      searchQuery = {
        query: {
          terms: {"_id": this.itemIds}
        },
        size: this.itemIds.length,
        ...this.sortQuery && {sort: [this.sortQuery]},
      }
    }
    else {
      searchQuery = this.completeQuery;
      searchQuery.size = this.selectedSize;
      searchQuery.from = this.selectedFrom;
    }

    this.exportSubscription = this.itemService.searchAndExport(searchQuery, this.selectedExportType, this.selectedCitationType, this.selectedCitationType === citationTypes.CSL ? this.selectedCslId : undefined, true).subscribe({
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
