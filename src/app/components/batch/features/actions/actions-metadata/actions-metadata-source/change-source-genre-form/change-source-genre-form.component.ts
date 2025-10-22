import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeSourceGenreParams } from 'src/app/components/batch/interfaces/batch-params';
import { SourceGenre } from 'src/app/model/inge';

import { TranslatePipe } from "@ngx-translate/core";
import { SortByLabelPipe } from "src/app/pipes/sort-by-label.pipe";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";


@Component({
  selector: 'pure-change-source-genre-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    SortByLabelPipe,
    ValidationErrorComponent
  ],
  templateUrl: './change-source-genre-form.component.html',
})
export class ChangeSourceGenreFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  elRef: ElementRef = inject(ElementRef);

  sourceGenres = Object.keys(SourceGenre);

  public changeSourceGenreForm: FormGroup = this.fb.group({
    sourceGenreFrom: ['Genre', [Validators.required]],
    sourceGenreTo: ['Genre', [Validators.required]],
  }, {
    validators: [this.valSvc.notSameValues('sourceGenreFrom', 'sourceGenreTo')]
  });

  get changeSourceGenreParams(): ChangeSourceGenreParams {
    const actionParams: ChangeSourceGenreParams = {
      sourceGenreFrom: this.changeSourceGenreForm.controls['sourceGenreFrom'].value,
      sourceGenreTo: this.changeSourceGenreForm.controls['sourceGenreTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit(): void {
    this.changeSourceGenreForm.reset();
  }
  
  onSubmit(): void {
    if (this.changeSourceGenreForm.valid) {
      this.batchSvc.changeSourceGenre(this.changeSourceGenreParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.changeSourceGenreForm.valid) {
      Object.keys(this.changeSourceGenreForm.controls).forEach(key => {
        const field = this.changeSourceGenreForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.changeSourceGenreForm.reset();
    }
  }
}
