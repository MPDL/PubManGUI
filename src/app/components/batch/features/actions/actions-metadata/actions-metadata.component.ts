import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ActionsMetadataFilesComponent } from './actions-metadata-files/actions-metadata-files.component';
import { ActionsMetadataExternalReferencesComponent } from './actions-metadata-external-references/actions-metadata-external-references.component';
import { ActionsMetadataOrcidComponent } from './actions-metadata-orcid/actions-metadata-orcid.component';
import { ActionsMetadataPublicationComponent } from './actions-metadata-publication/actions-metadata-publication.component';
import { ActionsMetadataSourceComponent } from './actions-metadata-source/actions-metadata-source.component';

@Component({
  selector: 'pure-batch-actions-metadata',
  standalone: true,
  imports: [
    CommonModule,
    ActionsMetadataFilesComponent,
    ActionsMetadataExternalReferencesComponent,
    ActionsMetadataOrcidComponent,
    ActionsMetadataPublicationComponent,
    ActionsMetadataSourceComponent
  ],
  templateUrl: './actions-metadata.component.html',
})
export class ActionsMetadataComponent { }
