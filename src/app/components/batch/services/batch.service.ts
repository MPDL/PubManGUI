import { signal, computed, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, Observable, throwError } from 'rxjs';
import { inge_rest_uri } from 'src/assets/properties.json';

import type * as params from '../interfaces/actions-params';
import type * as resp from '../interfaces/actions-responses';

import { ignoredStatuses } from 'src/app/services/interceptors/http-error.interceptor';
import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ItemVersionVO, BatchProcessLogHeaderState } from 'src/app/model/inge';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  readonly #baseUrl: string = inge_rest_uri;

  datasetList = "dataset-list";
  savedSelection = "datasets-checked";

  constructor(
    private http: HttpClient,
    public aa: AaService,
    private msgSvc: MessageService) { }

  get token(): string {
    return this.aa.token || '';
  }

  get user(): string {
    return this.aa.principal.getValue().user?.objectId || '';
  }

  addToBatchDatasets(selection: string): number {
    const fromSelection = sessionStorage.getItem(selection);
    let datasets: string[] = this.items;
    const prev = datasets.length;
    if (fromSelection) {
      this.items = datasets.concat(JSON.parse(fromSelection).filter((element: string) => !datasets.includes(element)));
      return Math.abs(this.items.length - prev); // added
    }
    return 0;
  }

  removeFromBatchDatasets(selection: string): number {
    const fromSelection = sessionStorage.getItem(selection);
    let datasets: string[] = this.items;
    const prev = datasets.length;
    if (fromSelection && prev > 0) {
      this.items = datasets.filter((element: string) => !fromSelection.includes(element));
      return Math.abs(prev - this.items.length); // removed
    }
    return 0;
  }

  #itemsCount = signal(0);

  public getItemsCount = computed( () => this.#itemsCount() );

  get items(): string[] {
    const itemList = sessionStorage.getItem(this.datasetList);
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

    sessionStorage.setItem(this.datasetList, JSON.stringify(items));
  }

  #itemsSelected = signal(false);

  public areItemsSelected = computed( () => this.#itemsSelected() );

  startProcess(id: number) {
    this.batchProcessLogHeaderId = id;
    this.#processRunning.set(true);
    this.items = [];

    this.msgSvc.info(`Action started!\n`);
    this.updateProcessProgress();
  }

  endProcess() {
    this.batchProcessLogHeaderId = -1;
    this.#processRunning.set(false);

    this.msgSvc.info(`Action finished!\n`);
  }

  #processRunning = signal(false);

  public isProcessRunning = computed( () => this.#processRunning() );

  #processLog = signal({} as resp.BatchProcessLogHeaderDbVO);

  public getProcessLog = computed( () => this.#processLog() );

  updateProcessProgress() {
    if (this.#processRunning()) {
      this.getBatchProcessLogHeaderId(this.batchProcessLogHeaderId).subscribe(resp => {
        this.#processLog.set(resp);
        if (resp.state === BatchProcessLogHeaderState.RUNNING) {
          setTimeout(() => {
            this.updateProcessProgress();
          }, 5000); // 1000); on PROD
        } else {
          this.endProcess();
        }
      })
    }
  }

  set batchProcessLogHeaderId(id: number) {
    sessionStorage.setItem('batchProcessLogHeaderId', id.toString());
  }

  get batchProcessLogHeaderId(): number {
    const batchProcessLogHeaderId = sessionStorage.getItem('batchProcessLogHeaderId');
    if (batchProcessLogHeaderId) {
      return JSON.parse(batchProcessLogHeaderId);
    } else {
      return -1;
    }
  }

  getIpList(): Observable<resp.ipList[]> {
    const url = `${this.#baseUrl}/miscellaneous/getIpList`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.ipList[]>(url, { headers });
  }

  getItem(id: string): Observable<ItemVersionVO> {
    const url = `${this.#baseUrl}/items/${id}`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<ItemVersionVO>(url, { headers });
  }

  getBatchProcessUserLock(): Observable<resp.getBatchProcessUserLockResponse> {
    const url = `${this.#baseUrl}/batchProcess/getBatchProcessUserLock`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.getBatchProcessUserLockResponse>(url, { headers, context: ignoredStatuses([404]) });
  }

  deleteBatchProcessUserLock(): Observable<any> {
    const url = `${this.#baseUrl}/batchProcess/deleteBatchProcessUserLock/${ this.user }`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.delete<any>(url, { headers });
  }

  getAllBatchProcessLogHeaders(): Observable<resp.BatchProcessLogHeaderDbVO[]> {
    const url = `${this.#baseUrl}/batchProcess/getAllBatchProcessLogHeaders`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.BatchProcessLogHeaderDbVO[]>(url, { headers });
  }

  getBatchProcessLogHeaderId(batchLogHeaderId: number): Observable<resp.BatchProcessLogHeaderDbVO> {
    const url = `${this.#baseUrl}/batchProcess/${batchLogHeaderId}`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.BatchProcessLogHeaderDbVO>(url, { headers });
  }

  getBatchProcessLogDetails(batchProcessLogDetailId: number): Observable<resp.getBatchProcessLogDetailsResponse[]> {
    const url = `${this.#baseUrl}/batchProcess/batchProcessLogDetails/${batchProcessLogDetailId}`;
    const headers = new HttpHeaders().set('Authorization', this.token!);

    return this.http.get<resp.getBatchProcessLogDetailsResponse[]>(url, { headers });
  }

  deletePubItems(actionParams: params.DeletePubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/submitPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  submitPubItems(actionParams: params.SubmitPubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/submitPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  revisePubItems(actionParams: params.RevisePubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/revisePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  releasePubItems(actionParams: params.ReleasePubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/releasePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  withdrawPubItems(actionParams: params.WithdrawPubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/withdrawPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeContext(actionParams: params.ChangeContextParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeContext`;
    const query = `?contextFrom=${actionParams.contextFrom}&contextTo=${actionParams.contextTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  addLocalTags(actionParams: params.AddLocalTagsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/addLocalTags`;
    const body = actionParams;
    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => {
          this.batchProcessLogHeaderId = value.batchLogHeaderId;
        }),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeLocalTags(actionParams: params.ChangeLocalTagParams): Observable<resp.actionGenericResponse> { // TO-DO check function name!
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeLocalTag`;
    const query = `?localTagFrom=${actionParams.localTagFrom}&localTagTo=${actionParams.localTagTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeGenre(actionParams: params.ChangeGenreParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeGenre`;
    const query = `?genreFrom=${actionParams.genreFrom}&genreTo=${actionParams.genreTo}&degreeType=${actionParams.degreeType}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError((error) => {
          return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
        })
      );

    return actionResponse;
  }

  changeFileVisibility(actionParams: params.ChangeFileVisibilityParams): Observable<resp.actionGenericResponse> {
    //console.log(`{\"userAccountIpRange\": ${JSON.stringify(actionParams.localTags)}}`);
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeFileVisibility`;
    const query = `?fileVisibilityFrom=${actionParams.fileVisibilityFrom}&fileVisibilityTo=${actionParams.fileVisibilityTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeFileContentCategory(actionParams: params.ChangeFileContentCategoryParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeFileContentCategory`;
    const query = `?fileContentCategoryFrom=${actionParams.fileContentCategoryFrom}&fileContentCategoryTo=${actionParams.fileContentCategoryTo}`;

    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceFileAudience(actionParams: params.ReplaceFileAudienceParams): Observable<resp.actionGenericResponse> {
    //console.log(`{\"audiences\": ${JSON.stringify(this.audiences)}}`);
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceFileAudience`;
    const body = actionParams; // TO-DO!

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeExternalReferenceContentCategory(actionParams: params.ChangeExternalReferenceContentCategoryParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeExternalReferenceContentCategory`;
    const query = `?externalReferenceContentCategoryFrom=${actionParams.externalReferenceContentCategoryFrom}&externalReferenceContentCategoryTo=${actionParams.externalReferenceContentCategoryTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceOrcid(actionParams: params.ReplaceOrcidParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceOrcid`;
    const query = `?creatorId=${actionParams.creatorId}&orcid=${actionParams.orcid}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeReviewMethod(actionParams: params.ChangeReviewMethodParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeReviewMethod`;
    const query = `?reviewMethodFrom=${actionParams.reviewMethodFrom}&reviewMethodTo=${actionParams.reviewMethodTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  addKeywords(actionParams: params.AddKeywordsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/addKeywords`;
    const query = `?keywords=${actionParams.keywords}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceKeywords(actionParams: params.ReplaceKeywordsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceKeywords`;
    const query = `?keywords=${actionParams.keywords}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeKeywords(actionParams: params.ChangeKeywordsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeKeywords`;
    const query = `?keywordsFrom=${actionParams.keywordsFrom}&keywordsTo=${actionParams.keywordsTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeSourceGenre(actionParams: params.ChangeSourceGenreParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeSourceGenre`;
    const query = `?sourceGenreFrom=${actionParams.sourceGenreFrom}&sourceGenreTo=${actionParams.sourceGenreTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  replaceSourceEdition(actionParams: params.ReplaceSourceEditionParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/replaceSourceEdition`;
    const query = `?sourceNumber=${actionParams.sourceNumber}&edition=${actionParams.edition}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  addSourceIdentifer(actionParams: params.AddSourceIdentiferParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/addSourceIdentifer`;
    const query = `?sourceNumber=${actionParams.sourceNumber}&sourceIdentifierType=${actionParams.sourceIdentifierType}&sourceIdentifier=${actionParams.sourceIdentifier}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

  changeSourceIdentifier(actionParams: params.ChangeSourceIdentifierParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url = `${this.#baseUrl}/batchProcess/changeSourceIdentifier`;
    const query = `?sourceNumber=${actionParams.sourceNumber}&sourceIdentifierType=${actionParams.sourceIdentifierType}&sourceIdentifierFrom=${actionParams.sourceIdentifierFrom}&sourceIdentifierTo=${actionParams.sourceIdentifierTo}`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>(url + query, body, { headers })
      .pipe(
        tap((value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value))),
        catchError(err => throwError(() => err)),
      );

    return actionResponse;
  }

}