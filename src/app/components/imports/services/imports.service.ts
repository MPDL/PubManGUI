import { signal, computed, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, of, Observable, throwError, EMPTY } from 'rxjs';
import { inge_rest_uri } from 'src/assets/properties.json';

import type * as params from '../interfaces/imports-params';
// import type * as resp from '../interfaces/imports-responses';
import { ImportLogDbVO, ImportLogItemDbVO, ImportLogItemDetailDbVO } from 'src/app/model/inge';
import { ItemVersionVO } from 'src/app/model/inge';

import { AaService } from 'src/app/services/aa.service';

@Injectable({
  providedIn: 'root'
})
export class ImportsService {

  readonly #baseUrl: string = inge_rest_uri;

  constructor(
    private http: HttpClient,
    public aa: AaService
  ) { 
    //this.checkImports();
  } 

  get token(): string {
    return this.aa.token || '';
  }

  #hasImports = signal(false);
  public hasImports = computed( () => this.#hasImports()); 

  #importRunning = signal(false);
  public isImportRunning = computed( () => this.#importRunning() );

  #lastFetch = signal<Observable<ItemVersionVO>>(of());
  public getLastFetch = computed( () => 
    this.#lastFetch()
  );

  checkImports() {
    this.getImportLogs()
      .subscribe(response => { 
        this.#hasImports.set( response.length ? true : false );
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

  getImportLogs(): Observable<ImportLogDbVO[]> {
    const url = `${this.#baseUrl}/import/getImportLogs`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ImportLogDbVO[]>(url, { headers });
  }

  getImportLogItems(id: number): Observable<ImportLogItemDbVO[]> {
    const url = `${this.#baseUrl}/import/importLogItems/${id}`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ImportLogItemDbVO[]>(url, { headers });
  }

  getImportLogItemDetails(id: number): Observable<ImportLogItemDetailDbVO[]> {
    const url = `${this.#baseUrl}/import/importLogItemDetails/${id}`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ImportLogItemDetailDbVO[]>(url, { headers });
  }

  deleteImportLog(id: number): Observable<any> {
    const url = `${this.#baseUrl}/import/importLog/${id}`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.delete<any>(url, { headers });
  }

  getFormatConfiguration(format: string): Observable<any> {
    const url = `${this.#baseUrl}/import/getFormatConfiguration`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    const query = `?format=${format}`;

    return this.http.get<any>(url + query, { headers })
  }

  postImport(importParams: params.PostImportParams, data: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', this.token!)
      .set('Content-Type', 'application/octet-stream')
      .set('Content-Disposition', 'attachment');
    const url = `${this.#baseUrl}/import/import`;
    const query = `?contextId=${importParams.contextId}&importName=${importParams.importName}&format=${importParams.format}`;

    return this.http.post<any>(url + query, data, { headers });
  }
  
}