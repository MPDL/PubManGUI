import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO } from 'src/app/model/inge';
import { ImportValidatorsService } from 'src/app/components/imports/services/import-validators.service';
import { ImportsService } from 'src/app/components/imports/services/imports.service';
import type { GetArxivParams, GetCrossrefParams } from 'src/app/components/imports/interfaces/imports-params';
import { AaService } from 'src/app/services/aa.service';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";
import { MessageService } from "src/app/services/message.service";

@Component({
  selector: 'pure-imports-new-fetch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './fetch.component.html',
})
export default class FetchComponent implements OnInit {
  importsSvc = inject(ImportsService);
  valSvc = inject(ImportValidatorsService);
  router = inject(Router);
  fb = inject(FormBuilder);
  aaSvc = inject(AaService);
  translateService = inject(TranslateService);
  msgSvc = inject(MessageService);

  user_contexts?: ContextDbRO[] = [];

  dinamicPlaceholder = "10.1000/1000xyz";

  ngOnInit(): void {
    this.aaSvc.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    );

    this.fetchForm.controls['source'].valueChanges.subscribe(source => {
      if (source === 'arxiv') {
        this.dinamicPlaceholder = 'arXiv:yymm.nnnnn';
      } else {
        this.dinamicPlaceholder = '10.1000/1000xyz';
      }
    });
  }

  public fetchForm: FormGroup = this.fb.group({
    contextId: [this.translateService.instant(_('imports.context')), Validators.required],
    source: ['crossref'],
    identifier: ['', [Validators.required, this.valSvc.forbiddenURLValidator(/http/i)]],
    fullText: ['FULLTEXT_DEFAULT']
  },
    { validators: [this.valSvc.allRequiredValidator()] }
  );

  get getCrossrefParams(): GetCrossrefParams {
    const importParams: GetCrossrefParams = {
      contextId: this.fetchForm.controls['contextId'].value,
      identifier: this.fetchForm.controls['identifier'].value
    }
    return importParams;
  }

  arxiv = /arxiv:/gi;
  get getArxivParams(): GetArxivParams {
    const importParams: GetArxivParams = {
      contextId: this.fetchForm.controls['contextId'].value,
      identifier: this.fetchForm.controls['identifier'].value.replace(this.arxiv, '').trim(),
      fullText: this.fetchForm.controls['fullText'].value
    }
    return importParams;
  }

  onSubmit(): void {
    if (this.fetchForm.invalid) {
      this.fetchForm.markAllAsTouched();
      return;
    }

    const source = this.fetchForm.controls['source'].value;
    this.fetchStart();


    switch (source) {
      case 'crossref':
        this.importsSvc.getCrossref(this.getCrossrefParams).subscribe({
          next: () => {
            this.router.navigateByUrl('/edit_import');
          },
          error: (response) => {
            if (response.error.cause !== undefined ) {
              this.msgSvc.warning(JSON.stringify(response.error.cause.cause.message));
            } else {
              this.msgSvc.warning(JSON.stringify(response.error.exception));
            }
            this.fetchEnd();
          },
        });
        break;
      case 'arxiv':
        this.importsSvc.getArxiv(this.getArxivParams).subscribe({
          next: () => {
            this.router.navigateByUrl('/edit_import');
          },
          error: (response) => {
            if (response.error.cause !== undefined ) {
              this.msgSvc.warning(JSON.stringify(response.error.cause.cause.message));
            } else {
              this.msgSvc.warning(JSON.stringify(response.error.exception));
            }
            this.fetchEnd();
          },
        });
    }
  }

  fetchStart(): void {
    let element = document.getElementById('go') as HTMLButtonElement;
    element.ariaDisabled = 'true';
    element.tabIndex = -1;
    element.classList.add('disabled');
    element.classList.replace('border-2', 'border-0');
    element.innerHTML = '<span class="spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>'
  }

  fetchEnd(): void {
    let element = document.getElementById('go') as HTMLButtonElement;
    element.ariaDisabled = 'false';
    element.tabIndex = 0;
    element.classList.remove('disabled');
    element.classList.replace('border-0', 'border-2');
    element.innerHTML = 'GO'
  }

}
