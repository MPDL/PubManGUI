import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO } from 'src/app/model/inge';
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

  // Initialized for Development ... TO-CLEAR
  public fetchForm: FormGroup = this.fb.group({
    contextId: ['ctx_persistent3', [Validators.required]],
    source: ['crossref', [Validators.required]],
    identifier: ['10.1038%2Fs41586-021-04387-1', [Validators.required]],
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

    switch (source) {
      case 'crossref':
        this.importsSvc.getCrossref(this.getCrossrefParams).subscribe(importResponse => {
          this.router.navigateByUrl('/edit_import');
        });
        break;
      case 'arxiv':
        this.importsSvc.getArxiv(this.getArxivParams).subscribe(importResponse => {
          this.router.navigateByUrl('/edit_import');
        });
    }
  }

}
