import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO } from 'src/app/model/inge';
import { ImportValidatorsService } from 'src/app/components/imports/services/import-validators.service';
import { ImportsService } from 'src/app/components/imports/services/imports.service';
import type { GetCrossrefParams, GetArxivParams } from 'src/app/components/imports/interfaces/imports-params';
import { AaService } from 'src/app/services/aa.service';

@Component({
  selector: 'pure-imports-new-fetch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fetch.component.html',
})
export default class FetchComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public validSvc: ImportValidatorsService, 
    private aaSvc: AaService,
    private importsSvc: ImportsService,
    private router: Router) { }

  user_contexts?: ContextDbRO[] = [];

  ngOnInit(): void {
    this.aaSvc.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    );
  }

  public fetchForm: FormGroup = this.fb.group({
    contextId: [$localize`:@@imports.context:Context`, [Validators.required]],
    source: ['crossref', [Validators.required]],
    identifier: ['', [Validators.required, this.validSvc.forbiddenURLValidator(/http/i)]],
    fullText: ['FULLTEXT_DEFAULT']
  });

  get getCrossrefParams(): GetCrossrefParams {
    const importParams: GetCrossrefParams = {
      contextId: this.fetchForm.controls['contextId'].value,
      identifier: this.fetchForm.controls['identifier'].value
    }
    return importParams;
  }

  get getArxivParams(): GetArxivParams {
    const importParams: GetArxivParams = {
      contextId: this.fetchForm.controls['contextId'].value,
      identifier: this.fetchForm.controls['identifier'].value,
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

    let element = document.getElementById('go') as HTMLButtonElement;
    element.ariaDisabled = 'true';
    element.tabIndex = -1;
    element.classList.add('disabled');
    element.classList.replace('border-2', 'border-0');
    element.innerHTML = '<span class="spinner-border spinner-border-sm text-secondary" aria-hidden="true"></span>'

    switch (source) {
      case 'crossref':
        this.importsSvc.getCrossref(this.getCrossrefParams).subscribe(() => {
          this.router.navigateByUrl('/edit_import');
        });
        break;
      case 'arxiv':
        this.importsSvc.getArxiv(this.getArxivParams).subscribe(() => {
          this.router.navigateByUrl('/edit_import');
        });
    }       
  }

}
