import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO } from 'src/app/model/inge';
import { AaService } from 'src/app/services/aa.service';

import { FileUploadComponent } from 'src/app/components/item-edit/form/file-upload/file-upload.component'

@Component({
  selector: 'pure-imports-new-import',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadComponent
  ],
  templateUrl: './import.component.html'
})
export default class ImportComponent implements OnInit { 

  constructor(
    private fb: FormBuilder, 
    private aaSvc: AaService,
    private router: Router) { }

  user_contexts?: ContextDbRO[] = [];  

  ngOnInit(): void {
    this.aaSvc.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    );
  }

  public importForm: FormGroup = this.fb.group({
    context: [$localize`:@@batch.actions.context:Context`, [Validators.required]],
    format: ['BMC_XML', [Validators.required]],
    name: ['', [Validators.required]],
    schema: ['OTHER', [Validators.required]],
    cone: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.importForm.invalid) {
      this.importForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/imports/myimports']);
  }
}