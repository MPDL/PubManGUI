import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, Observable, of, throwError } from 'rxjs';
import { inge_rest_uri } from 'src/assets/properties.json';

import * as params from '../interfaces/actions-params';
import * as resps from '../interfaces/actions-responses';

import { ignoredStatuses } from 'src/app/services/interceptors/http-error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  private readonly baseUrl: string = inge_rest_uri;

  private ouList: resps.ipList[] = [];

  constructor(private http: HttpClient) { }

  get items(): any {
    const itemList = sessionStorage.getItem('item_list');
    if (itemList) { 
      return JSON.parse(itemList); 
    } else {
      return null;
      // throw new Error('Please, select items to be processed!');
    }
  }

  get token(): string | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      return token; 
    } else throw new Error('Please, log in!');
  }

  get user(): any {
    const user_string = sessionStorage.getItem('user');
    if (user_string) {
      return JSON.parse(user_string);
    } else throw new Error('Please, log in!');
  }

  set batchProcessLogHeaderId(id: string) {
    sessionStorage.setItem('batchProcessLogHeaderId', id);
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

  getIpList():Observable<resps.ipList[]> {
    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/miscellaneous/getIpList`;
    return this.http.get<resps.ipList[]>(url, { headers });
  }

  getAllBatchProcessLogHeaders():Observable<resps.getBatchProcessUserLockResponse> {
    const url  = `${ this.baseUrl }/batchProcess/getAllBatchProcessLogHeaders`;
    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
      return this.http.get<resps.getBatchProcessUserLockResponse>(url, { headers });
  }

  getBatchProcessLogHeaderId():Observable<resps.BatchProcessLogHeaderDbVO> {
    const url  = `${ this.baseUrl }/batchProcess/${ this.batchProcessLogHeaderId }`;
    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
      return this.http.get<resps.BatchProcessLogHeaderDbVO>(url, { headers });
  }

  getBatchProcessLogDetails():Observable<resps.getBatchProcessLogDetailsResponse> {
    const url  = `${ this.baseUrl }/batchProcess/batchProcessLogDetails/${ this.batchProcessLogHeaderId }`;
    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
      return this.http.get<resps.getBatchProcessLogDetailsResponse>(url, { headers });
  }

  getBatchProcessUserLock():Observable<resps.getBatchProcessUserLockResponse> {
    const url  = `${ this.baseUrl }/batchProcess/getBatchProcessUserLock`;
    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
      return this.http.get<resps.getBatchProcessUserLockResponse>(url, { headers, context: ignoredStatuses([404]) });
  }

  deleteBatchProcessUserLock():Observable<any> {
    const url  = `${ this.baseUrl }/batchProcess/deleteBatchProcessUserLock/${ this.user }`;
    const headers = new HttpHeaders()
      .set('Authorization', this.token!);
      return this.http.get<any>(url, { headers });
  }

  deletePubItems(actionParams: params.DeletePubItemsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/submitPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  submitPubItems(actionParams: params.SubmitPubItemsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/submitPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }
  
  revisePubItems(actionParams: params.RevisePubItemsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/revisePubItems`; 
    const body = actionParams; 

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => { 
          console.log('Success: \n' + JSON.stringify(value));
          this.batchProcessLogHeaderId(value.batchLogHeaderId);
        } ),
        catchError( err => throwError( () => err )),
      ); 

    return actionResponse;
  }

  releasePubItems(actionParams: params.ReleasePubItemsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/releasePubItems`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  withdrawPubItems(actionParams: params.WithdrawPubItemsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/withdrawPubItems`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );
    
    return actionResponse;
  }

  changeContext(actionParams: params.ChangeContextParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeContext`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }
  
  addLocalTags(actionParams: params.AddLocalTagsParams): Observable<resps.actionGenericResponse> {
    //console.log(`{\"localTags\": ${JSON.stringify(actionParams.localTags)}}`); // DEBUG
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);  // console.log('headers.Authorization: \n' + headers.get('Authorization')); // DEBUG
    const url  = `${ this.baseUrl }/batchProcess/addLocalTags`;
    const body = actionParams; // console.log('actionParams: \n' + JSON.stringify(actionParams)); // DEBUG

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      ); // console.log('actionResponse: \n' + JSON.stringify(actionResponse)); // DEBUG

    return actionResponse;
  } 

  changeLocalTags(actionParams: params.ChangeLocalTagParams): Observable<resps.actionGenericResponse> { // TO-DO check function name!
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeLocalTag`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  } 

  changeGenre(actionParams: params.ChangeGenreParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeGenre`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeFileVisibility(actionParams: params.ChangeFileVisibilityParams): Observable<resps.actionGenericResponse> {  
    //console.log(`{\"userAccountIpRange\": ${JSON.stringify(actionParams.localTags)}}`);
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeFileVisibility`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeFileContentCategory(actionParams: params.ChangeFileContentCategoryParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeFileContentCategory`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceFileAudience(actionParams: params.ReplaceFileAudienceParams): Observable<resps.actionGenericResponse> {
    //console.log(`{\"audiences\": ${JSON.stringify(this.audiences)}}`);
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceFileAudience`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeExternalReferenceContentCategory(actionParams: params.ChangeExternalReferenceContentCategoryParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeExternalReferenceContentCategory`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceOrcid(actionParams: params.ReplaceOrcidParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceOrcid`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  } 

  changeReviewMethod(actionParams: params.ChangeReviewMethodParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeReviewMethod`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  addKeywords(actionParams: params.AddKeywordsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/addKeywords`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceKeywords(actionParams: params.ReplaceKeywordsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceKeywords`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeKeywords(actionParams: params.ChangeKeywordsParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeKeywords`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  changeSourceGenre(actionParams: params.ChangeSourceGenreParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeSourceGenre`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  replaceSourceEdition(actionParams: params.ReplaceSourceEditionParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/replaceSourceEdition`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

  addSourceIdentifer(actionParams: params.AddSourceIdentiferParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/addSourceIdentifer`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }
  
  changeSourceIdentifier(actionParams: params.ChangeSourceIdentifierParams): Observable<resps.actionGenericResponse> {
    actionParams.itemIds = this.items;

    const headers = new HttpHeaders().set('Authorization', this.token!);
    const url  = `${ this.baseUrl }/batchProcess/changeSourceIdentifier`;
    const body = actionParams;

    const actionResponse: Observable<resps.actionGenericResponse> = this.http.put<resps.actionGenericResponse>( url, body, { headers })
      .pipe(
        tap( (value: resps.actionGenericResponse) => console.log('Success: \n' + JSON.stringify(value)) ),
        catchError( err => throwError( () => err )),
      );

    return actionResponse;
  }

}