import { CommonModule } from '@angular/common';
import { OnInit, Component, ChangeDetectorRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO, ImportFormat } from 'src/app/model/inge';
import { ImportsService } from 'src/app/components/imports/services/imports.service';
import type { PostImportParams } from 'src/app/components/imports/interfaces/imports-params';
import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';

import { AaService } from 'src/app/services/aa.service';


@Component({
  selector: 'pure-imports-new-import',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SeparateFilterPipe
  ],
  templateUrl: './import.component.html',
  styles: [".dropzone { width: 100%; padding: 0.5rem 1.5rem 0.5rem 1.5rem; text-align: center; border: dashed 2px; }"], // TO-DO move to scss
})
export default class ImportComponent implements OnInit {
  formatObject: any = null;
  lastFormat: string = '';
  data: any = '';

  constructor(
    private fb: FormBuilder,
    private aaSvc: AaService,
    private importSvc: ImportsService,
    private changeDetector: ChangeDetectorRef,
    private router: Router) { }

  importFormat = Object.keys(ImportFormat);
  user_contexts?: ContextDbRO[] = [];

  public importForm: FormGroup = this.fb.group({
    contextId: [$localize`:@@imports.context:Context`, [Validators.required]],
    importName: ['', [Validators.required]],
    format: ['ENDNOTE_STRING', [Validators.required]],
    formatConfig: [''],
    cone: [''],
    fileName: ['']
  });

  ngOnInit(): void {
    this.aaSvc.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    );
  }

  ngDoCheck() {
    this.getFormatConfiguration(this.importForm.get('format')!.value);
  }

  getFormatConfiguration(format: string) {
    this.importSvc.getFormatConfiguration(format).subscribe(response => {
      this.formatObject = response;
      this.changeDetector.detectChanges();
      if (format !== this.lastFormat) {
        this.setDefaultOption(); 
        this.lastFormat = format;
      };
    });
  }

  hasConfig(): boolean {
    return (this.formatObject !== null && Object.keys(this.formatObject).length > 0);
  }

  isCoNE(): boolean {
    if (this.hasConfig()) {
      const defaultArray = this.formatObject["_default"];
      const coNEEntry = defaultArray.find((entry: string) => entry.startsWith("CoNE="));
      if (coNEEntry) {
        return (coNEEntry.split("=")[1] === "true");
      }
    }
    return false;
  }

  hasSelect(): boolean {
    return (this.formatObject !== null && Object.keys(this.formatObject).length > 2);
  }

  getSelectName(): string {
    return Object.keys(this.formatObject)[2];
  }

  getOptionList(): string[] {
    return Object.entries(this.formatObject)[2][1] as string[];
  }

  setDefaultOption(): void {
    const defaultArray = this.formatObject["_default"];
    const defaultValue = defaultArray.find((entry: string) => entry.startsWith(this.getSelectName())).split("=")[1];
    this.importForm.get('formatConfig')?.setValue(defaultValue);
  }

  onDragOver($event: any): void {
    $event.preventDefault();
  }

  onFileDrop($event: any): void {
    $event.preventDefault();
    if ($event.dataTransfer?.files && $event.dataTransfer.files[0]) {
      this.getData($event.dataTransfer.files[0]);
    }
  }

  onChange($event: any): void {
    $event.preventDefault();
    if ($event.target.files && $event.target.files[0]) {
      this.getData($event.target.files[0]);
    }
  }

  getData(file: File) {
    let element = document.getElementById('selectedFile') as HTMLElement;
    element.innerHTML = `<span class="material-symbols-outlined">description</span> <strong> ${file?.name} </strong>`;

    const reader = file.stream().getReader();
    let result: any = null;
  
    reader.read().then(
      function processData({ done, value }):any {
        if (done) {
          return;
        }
    
        const chunk = value;
        result += new TextDecoder().decode(chunk);

        return reader.read().then(processData);
      }
    ).finally(() => { this.data = result; });  
  }

  get getImportParams(): PostImportParams {
    const importParams: PostImportParams = {
      contextId: this.importForm.controls['contextId'].value,
      importName: this.importForm.controls['importName'].value,
      format: this.importForm.controls['format'].value,
      formatConfig: this.importForm.controls['formatConfig'].value,
    }
    return importParams;
  }

  onSubmit(): void {
    if (this.importForm.invalid) {
      this.importForm.markAllAsTouched();
      return;
    }

    this.importSvc.postImport(this.getImportParams, this.data).subscribe(importResponse => {
      this.router.navigate(['/imports/myimports']);
    });

  }
}