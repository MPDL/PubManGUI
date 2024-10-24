import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO } from 'src/app/model/inge';
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
    context: [$localize`:@@batch.actions.context:Context`, [Validators.required]],
    source: ['1', [Validators.required]]
  });

  onSubmit(): void {
    if (this.fetchForm.invalid) {
      this.fetchForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/import']);
  }

}
