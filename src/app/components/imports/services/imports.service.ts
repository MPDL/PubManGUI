import { signal, computed, Injectable } from '@angular/core';
import { BatchService } from 'src/app/components/batch/services/batch.service';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  constructor(private batchSvc: BatchService) { }

  public haveImports = computed( () => this.batchSvc.areItemsSelected() );

  #importRunning = signal(false);
  public isImportRunning = computed( () => this.#importRunning() );
  
}