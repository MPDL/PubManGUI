import { signal, computed, effect, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, of, Observable, throwError, EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';

import type * as params from '../interfaces/imports-params';
// import type * as resp from '../interfaces/imports-responses';
import { ImportLogDbVO, ImportLogItemDbVO, ImportLogItemDetailDbVO, ImportStatus, ImportErrorLevel, AccountUserDbVO, } from 'src/app/model/inge';
import { ItemVersionVO } from 'src/app/model/inge';

import { AaService } from 'src/app/services/aa.service';
import { bool_query } from 'src/app/model/pure_search';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  readonly #baseUrl: string = environment.inge_rest_uri;

  constructor(
    private http: HttpClient,
    public aaSvc: AaService
  ) {
    //this.checkImports();
  }

  get token(): string {
    return this.aaSvc.token || '';
  }

  get isDepositor(): boolean {
    return this.aaSvc.principal.value.isDepositor;
  }

  get isModerator(): boolean {
    return this.aaSvc.principal.value.isModerator;
  }

  #hasImports = signal(false);
  public hasImports = computed(() => this.#hasImports());

  #importRunning = signal(false); // Deprecated
  public isImportRunning = computed(() => this.#importRunning()); // Deprecated

  lastPageNumFrom = signal({ myImports: 1, details: 1, log: 1 });

  #lastFetch = signal<Observable<ItemVersionVO>>(of());
  public getLastFetch = computed(() => this.#lastFetch());

  #logFilters = signal<ImportErrorLevel[]>([]);

  public setLogFilters(filters: ImportErrorLevel[]) {
    this.#logFilters.set(filters);
  }

  public getLogFilters = computed(() => this.#logFilters());

  checkImports() {
    this.getImportLogs()
      .subscribe(response => {
        this.#hasImports.set(response.length ? true : false);
      }
      );
  }

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

  getDataFetch(url: string, query: string, headers: HttpHeaders): Observable<ItemVersionVO> {
    const importResponse: Observable<ItemVersionVO> = this.http.get<ItemVersionVO>(url + query, { headers, withCredentials: true })
      .pipe(
        tap((value: ItemVersionVO) => {
          this.#lastFetch.set(of(value));
        }),
        catchError(err => throwError(() => err)),
      );

    return importResponse;
  }

  getImportLog(id: number): Observable<ImportLogDbVO> {
    const url = `${this.#baseUrl}/import/importLog/${id}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ImportLogDbVO>(url, { withCredentials: true });
  }

  getImportLogs(): Observable<ImportLogDbVO[]> {
    const url = `${this.#baseUrl}/import/getImportLogs`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ImportLogDbVO[]>(url, { withCredentials: true });
  }

  getImportLogItems(id: number): Observable<ImportLogItemDbVO[]> {
    const url = `${this.#baseUrl}/import/importLogItems/${id}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ImportLogItemDbVO[]>(url, { withCredentials: true });
  }

  getImportLogItemDetails(id: number): Observable<ImportLogItemDetailDbVO[]> {
    const url = `${this.#baseUrl}/import/importLogItemDetails/${id}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ImportLogItemDetailDbVO[]>(url, { withCredentials: true });
  }

  deleteImportLog(id: number): Observable<any> {
    const url = `${this.#baseUrl}/import/importLog/${id}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.delete<any>(url, { withCredentials: true });
  }

  getFormatConfiguration(format: string): Observable<any> {
    const url = `${this.#baseUrl}/import/getFormatConfiguration`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const query = `?format=${format}`;

    return this.http.get<any>(url + query, { withCredentials: true });
  }

  postImport(importParams: params.PostImportParams, data: any): Observable<any> {
    const url = `${this.#baseUrl}/import/import`;
    const headers = new HttpHeaders()
      //.set('Authorization', this.token!)
      .set('Content-Type', 'application/octet-stream')
      .set('Content-Disposition', 'attachment');
    const query = `?contextId=${importParams.contextId}&importName=${importParams.importName}&format=${importParams.format}`;

    return this.http.post<any>(url + query, data, { headers, withCredentials: true });
  }

  getContexts(ctxId: string): Observable<any> {
    const url = `${this.#baseUrl}/contexts/${ctxId}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<any>(url, { withCredentials: true });
  }

  deleteImportedItems(importLogId: number): Observable<any> {
    const url = `${this.#baseUrl}/import/deleteImportedItems`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const query = `?importLogId=${importLogId}`;

    const response: Observable<any> = this.http.put<any>(url + query,'', { withCredentials: true  })
      .pipe(
        tap((value: any) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return response;
  }

  submitImportedItems(importLogId: number, submitModus: string): Observable<any> {
    const url = `${this.#baseUrl}/import/submitImportedItems`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const query = `?importLogId=${importLogId}&submitModus=${submitModus}`;

    const response: Observable<any> = this.http.put<any>(url + query,'', { withCredentials: true })
      .pipe(
        tap((value: any) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return response;
  }

}
