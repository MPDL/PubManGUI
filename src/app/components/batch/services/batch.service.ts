import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import type * as params from '../interfaces/batch-params';
import * as resp from '../interfaces/batch-responses';

import { ignoredStatuses } from 'src/app/services/interceptors/http-error.interceptor';
import { AaService } from 'src/app/services/aa.service';
import { ItemsService } from "src/app/services/pubman-rest-client/items.service";
import { ItemVersionVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/services/message.service';

import { _, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  readonly #baseUrl: string = environment.inge_rest_uri;

  objectIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  datasetList = "dataset-list";
  savedSelection = "datasets-checked";

  updateDelay = 1;

  constructor(
    private http: HttpClient,
    public aaSvc: AaService,
    private itemSvc: ItemsService,
    private msgSvc: MessageService,
    private translateSvc: TranslateService) {
      this.objectIds$.next(this.objectIds);
    }

  get user(): string {
    return this.aaSvc.principal.getValue().user?.objectId || '';
  }

  lastPageNumFrom = signal({logs: 1, details: 1});

  #logFilters = signal<resp.BatchProcessLogDetailState[]>([]);
  public getLogFilters = computed( () => this.#logFilters() );

  public setLogFilters(filters: resp.BatchProcessLogDetailState[]) {
      this.#logFilters.set(filters);
  }

  addToBatchDatasets(selection: string[]): number {
    let datasets: string[] = this.items;
    const prev = datasets.length;
    if (selection) {
      this.items = datasets.concat(selection.filter((element: string) => !datasets.includes(element)));
      this.objectIds$.next(this.items);
      return Math.abs(this.items.length - prev); // added
    }
    return 0;
  }

  removeFromBatchDatasets(selection: string[]): number {
    let datasets: string[] = this.items;
    const prev = datasets.length;
    if (selection && prev > 0) {
      this.items = datasets.filter((element: string) => !selection.includes(element));
      this.objectIds$.next(this.items);
      return Math.abs(prev - this.items.length); // removed
    }
    return 0;
  }

  #itemsCount = signal(0);
  public getItemsCount = computed( () => this.#itemsCount() );

  get objectIds(): string[] {
    const itemList = localStorage.getItem(this.datasetList);
    if (itemList) {
      const items = JSON.parse(itemList);
      if (items.length > 0) {
        return items;
      }
    }
    return [];
  }

  get items(): string[] {
    const itemList = localStorage.getItem(this.datasetList);
    if (itemList) {
      const items = JSON.parse(itemList);
      if (items.length > 0) {
        this.#itemsSelected.set(true);
        this.#itemsCount.set(items.length);
        return items;
      }
    }
    this.#itemsSelected.set(false);
    this.#itemsCount.set(0);
    return [] as string[];
  }

  set items(items: string[]) {
    if (items.length > 0) {
      this.#itemsSelected.set(true);
      this.#itemsCount.set(items.length);
    } else {
      this.#itemsSelected.set(false);
      this.#itemsCount.set(0);
    }

    localStorage.setItem(this.datasetList, JSON.stringify(items));
  }

  #itemsSelected = signal(false);
  public areItemsSelected = computed( () => this.#itemsSelected() );

  startProcess(id: number) {
    this.batchProcessLogHeaderId = id;
    this.#processRunning.set(true);
    this.items = [];

    this.msgSvc.info(this.translateSvc.instant(_('batch.actions.start')) + '\n');
    this.updateProcessProgress();
  }

  endProcess() {
    this.batchProcessLogHeaderId = -1;
    this.#processRunning.set(false);

    this.msgSvc.success(this.translateSvc.instant(_('batch.actions.stop')) + '\n');
  }

  #processRunning = signal(false);
  public isProcessRunning = computed( () => this.#processRunning() );

  #processLog = signal({} as resp.BatchProcessLogHeaderDbVO);
  public getProcessLog = computed( () => this.#processLog() );

  updateProcessProgress() {
    if (this.#processRunning()) {
      this.getBatchProcessLogHeaderId(this.batchProcessLogHeaderId).subscribe(response => {
        this.#processLog.set(response);
        if (response.state === resp.BatchProcessLogHeaderState.RUNNING) {
          setTimeout(() => {
            this.updateProcessProgress();
          }, 1000 * (this.updateDelay < 60 ? Math.ceil(this.updateDelay++ / 10) : 60 ));
        } else {
          this.updateDelay = 1;
          this.endProcess();
        }
      })
    }
  }

  set batchProcessLogHeaderId(id: number) {
    localStorage.setItem('batchProcessLogHeaderId', id.toString());
  }

  get batchProcessLogHeaderId(): number {
    const batchProcessLogHeaderId = localStorage.getItem('batchProcessLogHeaderId');
    if (batchProcessLogHeaderId) {
      return JSON.parse(batchProcessLogHeaderId);
    } else {
      return -1;
    }
  }

  getSelectedItems(): ItemVersionVO[] {
    let datasets: ItemVersionVO[] = [];
    for (var id of this.items) {
        this.itemSvc.retrieve(id, true)
          .subscribe( actionResponse => {
            datasets.push(actionResponse);
            console.log(id);
          })
    };
    return datasets;
  }

  // Workflow

  getBatchProcessUserLock(): Observable<resp.BatchProcessUserLockDbVO> {
    const url = `${this.#baseUrl}/batchProcess/getBatchProcessUserLock`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.BatchProcessUserLockDbVO>(url, { withCredentials:true, context: ignoredStatuses([404]) });
  }

  deleteBatchProcessUserLock(): Observable<any> {
    const url = `${this.#baseUrl}/batchProcess/deleteBatchProcessUserLock/${ this.user }`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.delete<any>(url, { withCredentials: true });
  }

  // Logs

  getAllBatchProcessLogHeaders(): Observable<resp.BatchProcessLogHeaderDbVO[]> {
    const url = `${this.#baseUrl}/batchProcess/getAllBatchProcessLogHeaders`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.BatchProcessLogHeaderDbVO[]>(url, { withCredentials: true });
  }

  getBatchProcessLogHeaderId(batchLogHeaderId: number): Observable<resp.BatchProcessLogHeaderDbVO> {
    const url = `${this.#baseUrl}/batchProcess/${batchLogHeaderId}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.BatchProcessLogHeaderDbVO>(url, { withCredentials: true });
  }

  getBatchProcessLogDetails(batchProcessLogDetailId: number): Observable<resp.BatchProcessLogDetailDbVO[]> {
    const url = `${this.#baseUrl}/batchProcess/batchProcessLogDetails/${batchProcessLogDetailId}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.BatchProcessLogDetailDbVO[]>(url, { withCredentials: true });
  }

  getItem(itemId: string): Observable<ItemVersionVO> {
    const url = `${this.#baseUrl}/items/${itemId}`;
    //const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ItemVersionVO>(url, { withCredentials: true });
  }

  // Actions

  deletePubItems(actionParams: params.DeletePubItemsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/deletePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  submitPubItems(actionParams: params.SubmitPubItemsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/submitPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  revisePubItems(actionParams: params.RevisePubItemsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/revisePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  releasePubItems(actionParams: params.ReleasePubItemsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/releasePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  withdrawPubItems(actionParams: params.WithdrawPubItemsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/withdrawPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url, body, { withCredentials:true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeContext(actionParams: params.ChangeContextParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeContext`;
    const query = `?contextFrom=${actionParams.contextFrom}&contextTo=${actionParams.contextTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  addLocalTags(actionParams: params.AddLocalTagsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/addLocalTags`;
    const body = actionParams;
    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => {
          this.batchProcessLogHeaderId = value.batchLogHeaderId;
        }),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeLocalTags(actionParams: params.ChangeLocalTagParams): Observable<resp.ActionGenericResponse> { // TO-DO check function name!
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeLocalTag`;
    const query = `?localTagFrom=${actionParams.localTagFrom}&localTagTo=${actionParams.localTagTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeGenre(actionParams: params.ChangeGenreParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeGenre`;
    const query = `?genreFrom=${actionParams.genreFrom}&genreTo=${actionParams.genreTo}&degreeType=${actionParams.degreeType}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError((error) => {
          return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
        })
      );

    return actionResponse;
  }

  changeFileVisibility(actionParams: params.ChangeFileVisibilityParams): Observable<resp.ActionGenericResponse> {
    //console.log(`{\"userAccountIpRange\": ${JSON.stringify(actionParams.localTags)}}`);
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeFileVisibility`;
    const query = `?fileVisibilityFrom=${actionParams.fileVisibilityFrom}&fileVisibilityTo=${actionParams.fileVisibilityTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeFileContentCategory(actionParams: params.ChangeFileContentCategoryParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeFileContentCategory`;
    const query = `?fileContentCategoryFrom=${actionParams.fileContentCategoryFrom}&fileContentCategoryTo=${actionParams.fileContentCategoryTo}`;

    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceFileAudience(actionParams: params.ReplaceFileAudienceParams): Observable<resp.ActionGenericResponse> {
    //console.log(`{\"audiences\": ${JSON.stringify(this.audiences)}}`);
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceFileAudience`;
    const body = actionParams; // TO-DO!

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeExternalReferenceContentCategory(actionParams: params.ChangeExternalReferenceContentCategoryParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeExternalReferenceContentCategory`;
    const query = `?externalReferenceContentCategoryFrom=${actionParams.externalReferenceContentCategoryFrom}&externalReferenceContentCategoryTo=${actionParams.externalReferenceContentCategoryTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceOrcid(actionParams: params.ReplaceOrcidParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceOrcid`;
    const query = `?creatorId=${actionParams.creatorId}&orcid=${actionParams.orcid}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeReviewMethod(actionParams: params.ChangeReviewMethodParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeReviewMethod`;
    const query = `?reviewMethodFrom=${actionParams.reviewMethodFrom}&reviewMethodTo=${actionParams.reviewMethodTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  addKeywords(actionParams: params.AddKeywordsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/addKeywords`;
    const query = `?keywords=${actionParams.keywords}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceKeywords(actionParams: params.ReplaceKeywordsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceKeywords`;
    const query = `?keywords=${actionParams.keywords}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeKeywords(actionParams: params.ChangeKeywordsParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeKeywords`;
    const query = `?keywordsFrom=${actionParams.keywordsFrom}&keywordsTo=${actionParams.keywordsTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeSourceGenre(actionParams: params.ChangeSourceGenreParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeSourceGenre`;
    const query = `?sourceGenreFrom=${actionParams.sourceGenreFrom}&sourceGenreTo=${actionParams.sourceGenreTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceSourceEdition(actionParams: params.ReplaceSourceEditionParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceSourceEdition`;
    const query = `?sourceNumber=${actionParams.sourceNumber}&edition=${actionParams.edition}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  addSourceIdentifer(actionParams: params.AddSourceIdentiferParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders()//.set('Authorization', this.token!);
    headers.set('Access-Control-Allow-Origin', this.#baseUrl);
    const url = `${this.#baseUrl}/batchProcess/addSourceIdentifier`;
    const query = `?sourceNumber=${actionParams.sourceNumber}&sourceIdentifierType=${actionParams.sourceIdentifierType}&sourceIdentifier=${actionParams.sourceIdentifier}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { headers, withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeSourceIdentifier(actionParams: params.ChangeSourceIdentifierParams): Observable<resp.ActionGenericResponse> {
    actionParams.itemIds = this.items;

    //const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeSourceIdentifier`;
    const query = `?sourceNumber=${actionParams.sourceNumber}&sourceIdentifierType=${actionParams.sourceIdentifierType}&sourceIdentifierFrom=${actionParams.sourceIdentifierFrom}&sourceIdentifierTo=${actionParams.sourceIdentifierTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.ActionGenericResponse> = this.http.put<resp.ActionGenericResponse>(url + query, body, { withCredentials: true })
      .pipe(
        tap((value: resp.ActionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

}
