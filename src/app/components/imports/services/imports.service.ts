import { signal, computed, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, of, Observable, throwError, EMPTY } from 'rxjs';
import { inge_rest_uri } from 'src/assets/properties.json';

import type * as params from '../interfaces/imports-params';
//import type * as resp from '../interfaces/imports-responses';
import { ItemVersionVO } from 'src/app/model/inge';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  readonly #baseUrl: string = inge_rest_uri;

  constructor(
    private http: HttpClient,
    public aa: AaService,
    private msgSvc: MessageService,
    private batchSvc: BatchService) { }

  get token(): string {
    return this.aa.token || '';
  }

  public haveImports = computed( () => this.batchSvc.areItemsSelected() );

  #importsCount = signal(666); // Fake
  public getImportsCount = computed( () => this.#importsCount() );

  #importRunning = signal(false);
  public isImportRunning = computed( () => this.#importRunning() );

  #lastFetch = signal<Observable<ItemVersionVO>>(of());
  public getLastFetch = computed( () => 
    this.#lastFetch()
  );

  getCrossref(importParams: params.GetCrossrefParams): Observable<ItemVersionVO> {
    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
    const url = `${this.#baseUrl}/dataFetch/getCrossref`;
    const query = `?contextId=${importParams.contextId}&identifier=${importParams.identifier}`;

  return this.getDataFetch(url, query, headers);
  }

  getArxiv(importParams: params.GetArxivParams): Observable<ItemVersionVO> {
    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
    const url = `${this.#baseUrl}/dataFetch/getArxiv`;
    const query = `?contextId=${importParams.contextId}&identifier=${importParams.identifier}&fullText=${importParams.fullText}`;

    return this.getDataFetch(url, query, headers);
  }

  getDataFetch(url: string, query:string, headers: HttpHeaders ): Observable<ItemVersionVO> {
    const importResponse: Observable<ItemVersionVO> = this.http.get<ItemVersionVO>(url + query, { headers })
    .pipe(
      tap((value: ItemVersionVO) => {
        this.#lastFetch.set(of(value));
      }),
      catchError(err => throwError(() => err)),
    );

    return importResponse;
  }
  
}