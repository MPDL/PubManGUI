import { Component, Input } from '@angular/core';
import { citationTypes, exportTypes } from "../../../model/inge";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ItemsService } from "../../../services/pubman-rest-client/items.service";
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemSelectionService } from "../../../services/item-selection.service";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { LoadingComponent } from "../loading/loading.component";
import { contentDispositionParser } from "../../../utils/utils";
import { TranslatePipe } from "@ngx-translate/core";
import { JsonPipe } from "@angular/common";
import { PubManHttpErrorResponse } from "../../../services/interceptors/http-error.interceptor";
import { ConeAutosuggestComponent } from "../cone-autosuggest/cone-autosuggest.component";


@Component({
  selector: 'pure-export-items',
  standalone: true,
  imports: [
    FormsModule,
    LoadingComponent,
    TranslatePipe,
    JsonPipe,
    ConeAutosuggestComponent,
    ReactiveFormsModule
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

  selectedExportType: FormControl<string>;
  selectedCitationType: FormControl<string>;
  selectedCslId: FormControl<string>;
  selectedCslName: FormControl<string>;
  selectedSize = 500;
  selectedFrom = 0;

  currentCitation: string = '';

  protected loading = false;
  protected errorMessage: string = "";
  private exportSubscription?: Subscription;

  protected atomFeedUrl = "";

  constructor(private itemService: ItemsService, protected activeModal: NgbActiveModal, private selectionService: ItemSelectionService, formBuilder: FormBuilder) {

    this.selectedExportType = formBuilder.nonNullable.control(exportTypes.ENDNOTE);
    this.selectedCitationType  = formBuilder.nonNullable.control(citationTypes.APA);
    this.selectedCslId = formBuilder.nonNullable.control("");
    this.selectedCslName = formBuilder.nonNullable.control("");
  }

  ngOnInit() {

    const exportType = localStorage.getItem("exportType");
    if (exportType) {
      const expType: ExportType = JSON.parse(exportType);
      this.selectedExportType.setValue(expType.exportType);
      this.selectedCitationType.setValue(expType.citationType);
      this.selectedCslId.setValue(expType.cslId);
      this.selectedCslId.setValue(expType.cslId);
      this.selectedCslName.setValue(expType.cslName);
    }

    if(this.type === 'exportSelected') {
      this.itemIds = this.selectionService.selectedIds$.value;
    }


    this.loadCitation();
  }

  updateStoredExportInfo() {
    this.errorMessage = "";
    const exportType: ExportType = {
      exportType: this.selectedExportType.value,
      citationType: this.selectedCitationType.value,
      cslId: this.selectedCslId.value,
      cslName: this.selectedCslName.value,
    }
    localStorage.setItem("exportType", JSON.stringify(exportType));
  }

  loadCitation() {
    if (!this.isFormat && this.isValid()) {


      this.itemService.retrieveSingleCitation(this.itemIds[0], this.selectedCitationType.value, this.selectedCslId.value, {globalErrorDisplay: false}).subscribe({
        next: (cit) => {
          //console.log('Citation: ' +cit)
          this.currentCitation = cit;
        },
        error: e => {
          this.errorMessage = e.error.message;
          this.loading = false;
        },
      })
    }

  }

  isValid(): boolean {
    return this.itemIds.length > 0 &&
      (this.selectedCitationType.value !== citationTypes.CSL || (this.selectedCslId?.value?.length > 0));
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
    if(event) {
      this.selectedCslId.setValue(event.id);
      this.selectedCslName.setValue(event.value);
      if (this.selectedCslId.value)
        this.loadCitation();
      else {
        this.currentCitation = '';
      }

      this.updateStoredExportInfo();
    }
    else {
      this.selectedCslId.setValue('');
      this.currentCitation = '';
    }
    }


  get isFormat() {
    return this.selectedExportType.value === exportTypes.ENDNOTE ||
      this.selectedExportType.value === exportTypes.BIBTEX ||
      this.selectedExportType.value === exportTypes.JSON ||
      this.selectedExportType.value === exportTypes.ESCIDOC_ITEMLIST_XML ||
      this.selectedExportType.value === exportTypes.MARC_XML;

  }

  closeModal() {
    if(this.exportSubscription) {
      this.exportSubscription.unsubscribe();
    }
    this.activeModal.dismiss();
  }

  get downloadLink() {
    return this.restUri + '/items/' + this.itemIds[0]
      + '/export?format=' + this.selectedExportType.value
      + (this.selectedCitationType.value ? '&citation=' + this.selectedCitationType.value : '')
      + (this.selectedCslId.value ? '&cslConeId=' + this.selectedCslId.value : '')
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

    this.exportSubscription = this.itemService.searchAndExport(searchQuery, this.selectedExportType.value, this.selectedCitationType.value, this.selectedCitationType.value === citationTypes.CSL ? this.selectedCslId.value : undefined, {globalErrorDisplay: false})
      .pipe(
        tap(result => {
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
        }),
        catchError((err:PubManHttpErrorResponse) => {
          this.errorMessage = err.userMessage;
          this.loading = false;
          return EMPTY;
         })
      )
      .subscribe()
  }
}

export interface ExportType {
  exportType: string;
  citationType: string;
  cslId: string;
  cslName: string;

}
