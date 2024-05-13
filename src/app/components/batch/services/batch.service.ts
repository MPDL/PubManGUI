import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, Observable, of, throwError } from 'rxjs';
import { inge_rest_uri } from 'src/assets/properties.json';

import * as params from '../interfaces/actions-params';
import * as resp from '../interfaces/actions-responses';

import { ignoredStatuses } from 'src/app/services/interceptors/http-error.interceptor';
import { AaService } from 'src/app/services/aa.service';
import { ItemVersionVO } from 'src/app/model/inge';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  private readonly baseUrl: string = inge_rest_uri;

  private ouList: resp.ipList[] = [];

  datasetList = "dataset-list";
  savedSelection = "datasets-checked";

  constructor(private http: HttpClient, public aa: AaService) { }

  addToBatchDatasets(selection: string) {
    const fromSelection = sessionStorage.getItem(selection);
    let datasets: string[] = this.items;
    if( fromSelection ) {
      this.items = datasets.concat(JSON.parse(fromSelection).filter((element: string) => !datasets.includes(element)));
    }
  }

  removeFromBatchDatasets(selection: string) {
      const fromSelection = sessionStorage.getItem(selection);
      let datasets: string[] = this.items;
      if( fromSelection ) {
        this.items = datasets.filter((element: string) => !fromSelection.includes(element));
      }
  }

  get items(): string[] {
    const itemList = sessionStorage.getItem(this.datasetList);
    if (itemList) {
      return JSON.parse(itemList);
    } else {
      return [] as string[];
    }
  }

  set items(items: string[]) {
    sessionStorage.setItem(this.datasetList, JSON.stringify(items));
  }

  get token(): string | undefined {
    const token = this.aa.token ? this.aa.token : undefined;
    if (token) {
      return token;
    } else throw new Error('Please, log in!');
  }

  get user(): any {
    const user_string = this.aa.principal.getValue().user?.objectId;
    if (user_string) {
      return user_string;
    } else throw new Error('Please, log in!');
  }

  set batchProcessLogHeaderId(id: number) {
    sessionStorage.setItem('batchProcessLogHeaderId', id.toString());
  }

  get batchProcessLogHeaderId(): any {
    const batchProcessLogHeaderId = sessionStorage.getItem('batchProcessLogHeaderId');
    if (batchProcessLogHeaderId) {
      return JSON.parse(batchProcessLogHeaderId);
    } else {
      return null;
      // else throw new Error('Please, log in!');
    }
  }

  // TO-DO
  // public updatePerson(event: any) {}

  // TO-DO
  // public updateContext(event: any) {}

  getIpList():Observable<resp.ipList[]> {
    const url  = `${ this.baseUrl }/miscellaneous/getIpList`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    return this.http.get<resp.ipList[]>(url, { headers });
  }

  getItem(id: string):Observable<ItemVersionVO> {
    const url  = `${ this.baseUrl }/items/${id}`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    return this.http.get<ItemVersionVO>(url, { headers });
  }

  getAllBatchProcessLogHeaders():Observable<resp.BatchProcessLogHeaderDbVO[]> {
    const url  = `${ this.baseUrl }/batchProcess/getAllBatchProcessLogHeaders`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    return this.http.get<resp.BatchProcessLogHeaderDbVO[]>(url, { headers });
  }

  getBatchProcessLogHeaderId(batchLogHeaderId: number):Observable<resp.BatchProcessLogHeaderDbVO> {
    const url  = `${ this.baseUrl }/batchProcess/${ batchLogHeaderId }`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    return this.http.get<resp.BatchProcessLogHeaderDbVO>(url, { headers });
  }

  getBatchProcessLogDetails(batchProcessLogDetailId: number):Observable<resp.getBatchProcessLogDetailsResponse[]> {
    const url  = `${ this.baseUrl }/batchProcess/batchProcessLogDetails/${ batchProcessLogDetailId }`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    return this.http.get<resp.getBatchProcessLogDetailsResponse[]>(url, { headers });
  }

  getBatchProcessUserLock():Observable<resp.getBatchProcessUserLockResponse> {
    const url  = `${ this.baseUrl }/batchProcess/getBatchProcessUserLock`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    return this.http.get<resp.getBatchProcessUserLockResponse>(url, { headers, context: ignoredStatuses([404]) });
  }

  deleteBatchProcessUserLock():Observable<any> {
    const url  = `${ this.baseUrl }/batchProcess/deleteBatchProcessUserLock/${ this.user }`;
    const headers = new HttpHeaders().set('Authorization', this.token!);
    return this.http.get<any>(url, { headers });
  }

  deletePubItems(actionParams: params.DeletePubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/submitPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  submitPubItems(actionParams: params.SubmitPubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/submitPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  revisePubItems(actionParams: params.RevisePubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/revisePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  releasePubItems(actionParams: params.ReleasePubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/releasePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  withdrawPubItems(actionParams: params.WithdrawPubItemsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/withdrawPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeContext(actionParams: params.ChangeContextParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeContext`;
    const query = `?contextFrom=${ actionParams.contextFrom }&contextTo=${ actionParams.contextTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  addLocalTags(actionParams: params.AddLocalTagsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/addLocalTags`;
    const body = actionParams;
    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => {
          console.log('Success: \n' + JSON.stringify(value));
          this.batchProcessLogHeaderId = value.batchLogHeaderId;} ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeLocalTags(actionParams: params.ChangeLocalTagParams): Observable<resp.actionGenericResponse> { // TO-DO check function name!
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeLocalTag`;
    const query = `?localTagFrom=${ actionParams.localTagFrom }&localTagTo=${ actionParams.localTagTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeGenre(actionParams: params.ChangeGenreParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeGenre`;
    const query = `?genreFrom=${ actionParams.genreFrom }&genreTo=${ actionParams.genreTo }&degreeType=${ actionParams.degreeType }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeFileVisibility(actionParams: params.ChangeFileVisibilityParams): Observable<resp.actionGenericResponse> {
    //console.log(`{\"userAccountIpRange\": ${JSON.stringify(actionParams.localTags)}}`);
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeFileVisibility`;
    const query = `?fileVisibilityFrom=${ actionParams.fileVisibilityFrom }&fileVisibilityTo=${ actionParams.fileVisibilityTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeFileContentCategory(actionParams: params.ChangeFileContentCategoryParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeFileContentCategory`;
    const query = `?fileContentCategoryFrom=${ actionParams.fileContentCategoryFrom }&fileContentCategoryTo=${ actionParams.fileContentCategoryTo }`;

    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceFileAudience(actionParams: params.ReplaceFileAudienceParams): Observable<resp.actionGenericResponse> {
    //console.log(`{\"audiences\": ${JSON.stringify(this.audiences)}}`);
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceFileAudience`;
    const body = actionParams; // TO-DO!

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeExternalReferenceContentCategory(actionParams: params.ChangeExternalReferenceContentCategoryParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeExternalReferenceContentCategory`;
    const query = `?externalReferenceContentCategoryFrom=${ actionParams.externalReferenceContentCategoryFrom }&externalReferenceContentCategoryTo=${ actionParams.externalReferenceContentCategoryTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceOrcid(actionParams: params.ReplaceOrcidParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceOrcid`;
    const query = `?creatorId=${ actionParams.creatorId }&orcid=${ actionParams.orcid }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeReviewMethod(actionParams: params.ChangeReviewMethodParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeReviewMethod`;
    const query = `?reviewMethodFrom=${ actionParams.reviewMethodFrom }&reviewMethodTo=${ actionParams.reviewMethodTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  addKeywords(actionParams: params.AddKeywordsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/addKeywords`;
    const query = `?keywords=${ actionParams.keywords }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceKeywords(actionParams: params.ReplaceKeywordsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceKeywords`;
    const query = `?keywords=${ actionParams.keywords }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeKeywords(actionParams: params.ChangeKeywordsParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeKeywords`;
    const query = `?keywordsFrom=${ actionParams.keywordsFrom }&keywordsTo=${ actionParams.keywordsTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeSourceGenre(actionParams: params.ChangeSourceGenreParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeSourceGenre`;
    const query = `?sourceGenreFrom=${ actionParams.sourceGenreFrom }&sourceGenreTo=${ actionParams.sourceGenreTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceSourceEdition(actionParams: params.ReplaceSourceEditionParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceSourceEdition`;
    const query = `?sourceNumber=${ actionParams.sourceNumber }&edition=${ actionParams.edition }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  addSourceIdentifer(actionParams: params.AddSourceIdentiferParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/addSourceIdentifer`;
    const query = `?sourceNumber=${ actionParams.sourceNumber }&sourceIdentifierType=${ actionParams.sourceIdentifierType }&sourceIdentifier=${ actionParams.sourceIdentifier }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeSourceIdentifier(actionParams: params.ChangeSourceIdentifierParams): Observable<resp.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeSourceIdentifier`;
    const query = `?sourceNumber=${ actionParams.sourceNumber }&sourceIdentifierType=${ actionParams.sourceIdentifierType }&sourceIdentifierFrom=${ actionParams.sourceIdentifierFrom }&sourceIdentifierTo=${ actionParams.sourceIdentifierTo }`;
    const body = { itemIds: actionParams.itemIds };

    const actionResponse: Observable<resp.actionGenericResponse> = this.http.put<resp.actionGenericResponse>( url+query, body, { headers })
      .pipe(
        tap( (value: resp.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

}
