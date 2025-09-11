import { Component } from '@angular/core';
import { exportTypes } from "../../../model/inge";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ItemsService } from "../../../services/pubman-rest-client/items.service";
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemSelectionService } from "../../../services/item-selection.service";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { contentDispositionParser } from "../../../utils/utils";
import { TranslatePipe } from "@ngx-translate/core";
import { PubManHttpErrorResponse } from "../../../services/interceptors/http-error.interceptor";
import { OuAutosuggestComponent } from "../ou-autosuggest/ou-autosuggest.component";


@Component({
  selector: 'pure-jus-report',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    OuAutosuggestComponent,
    ReactiveFormsModule
  ],
  templateUrl: './jus-report.component.html'
})
export class JusReportComponent {

  protected restUri = environment.inge_rest_uri;

  reportForm: FormGroup<any>;

  protected loading = false;
  protected errorMessage: string = "";
  private exportSubscription?: Subscription;


  constructor(private itemService: ItemsService, protected activeModal: NgbActiveModal, private selectionService: ItemSelectionService, private formBuilder: FormBuilder) {

    this.reportForm = formBuilder.group({
      exportFormat: [exportTypes.JUS_HTML_XML],
      orgName: ['', Validators.required],
      orgId: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.pattern(/^\d{4}$/)]]
    })
  }

  ngOnInit() {
  }




/*
  isValid(): boolean {
    return this.itemIds.length > 0 &&
      (this.selectedCitationType !== citationTypes.CSL || (this.selectedCslId?.length > 0));
  }

 */









  closeModal() {
    if(this.exportSubscription) {
      this.exportSubscription.unsubscribe();
    }
    this.activeModal.dismiss();
  }



  download() {
    this.loading = true;

    this.exportSubscription = this.itemService.jusReport(this.reportForm.get('exportFormat')?.value, this.reportForm.get('orgId')?.value, this.reportForm.get('year')?.value, {globalErrorDisplay: false})
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

  protected readonly exportTypes = exportTypes;
}


