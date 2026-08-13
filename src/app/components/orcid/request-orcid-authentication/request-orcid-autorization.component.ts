import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ORCID_PATTERN} from "src/app/services/form-builder.service";
import {ConeService, PersonResource} from "src/app/services/cone.service";
import {ActivatedRoute} from "@angular/router";
import {BootstrapValidationDirective} from "src/app/directives/bootstrap-validation.directive";
import {ValidationErrorMessageDirective} from "src/app/directives/validation-error-message.directive";
import {ConeIconComponent} from "src/app/components/shared/cone-icon/cone-icon.component";

@Component({
  selector: 'pure-request-orcid-authorization',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BootstrapValidationDirective,
    ValidationErrorMessageDirective,
    ConeIconComponent
  ],
  templateUrl: './request-orcid-autorization.component.html',
  styleUrls: ['./request-orcid-autorization.component.scss'],
})
export class RequestOrcidAutorizationComponent implements OnInit {

  orcidRequestForm: FormGroup;
  private fb = inject(FormBuilder);
  private coneService = inject(ConeService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.orcidRequestForm = this.fb.group({
      coneId: ['', Validators.required],
      researcherName: [''],
      orcidId: ['', [Validators.required, Validators.pattern(ORCID_PATTERN)]],
      researcherEmail: ['', [Validators.email, Validators.required]],
      moderatorEmail: ['', [Validators.email, Validators.required]]
    });
  }

  ngOnInit(): void {
    const coneIdParam = this.route.snapshot.queryParamMap.get('coneId');
    if (!coneIdParam) {
      return;
    }

    const normalizedConeId = this.coneService.normalizePersonConeId(coneIdParam);
    this.coneService.getPersonResource(normalizedConeId).subscribe((person: PersonResource) => {
      const researcherName = `${person.http_xmlns_com_foaf_0_1_family_name ?? ''}, ${person.http_xmlns_com_foaf_0_1_givenname ?? ''}`
        .replace(/^,\s*|\s*,\s*$/g, '')
        .trim();
      const orcidId = this.coneService.getIdentifierValueByType(person.http_purl_org_dc_elements_1_1_identifier, 'ORCID');
      const researcherEmail = this.coneService.getIdentifierValueByType(person.http_purl_org_dc_elements_1_1_identifier, 'EMAIL')?.replace(/^mailto:/i, '');

      this.orcidRequestForm.patchValue({
        coneId: normalizedConeId,
        researcherName: researcherName || person.http_purl_org_dc_elements_1_1_title || person.http_purl_org_dc_terms_alternative || '',
        orcidId: orcidId || '',
        researcherEmail: researcherEmail || ''
      });
    });
  }

}
