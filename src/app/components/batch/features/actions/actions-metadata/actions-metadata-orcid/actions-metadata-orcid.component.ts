
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReplaceOrcidFormComponent } from './replace-orcid-form/replace-orcid-form.component'

@Component({
  selector: 'pure-batch-actions-metadata-orcid',
  standalone: true,
  imports: [
    ReplaceOrcidFormComponent
],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './actions-metadata-orcid.component.html',
})
export class ActionsMetadataOrcidComponent { }
