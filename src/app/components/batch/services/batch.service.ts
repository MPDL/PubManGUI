import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import * as ifs from '../interfaces/actions-params';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  constructor() {}

  get items(): any {
    const item_list = sessionStorage.getItem('item_list');
    if (item_list) { 
      return JSON.parse(item_list); 
    } else throw new Error('Please, select items to be processed!');
  }

  get token(): string | null {
    return sessionStorage.getItem('token');
  }

  get user(): any {
    const user_string = sessionStorage.getItem('user');
    if (user_string) return JSON.parse(user_string);
  }

  // TO-DO
  // public updatePerson(event: any) {}

  // TO-DO
  // public updateContext(event: any) {}

  get isProcessing(): boolean {
    return false;
  }

  deletePubItems(actionParams: ifs.DeletePubItemsParams): Observable<ifs.DeletePubItemsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.DeletePubItemsParams> = of(actionParams);
    return actionResponse;
  }

  submitPubItems(actionParams: ifs.SubmitPubItemsParams): Observable<ifs.SubmitPubItemsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.SubmitPubItemsParams> = of(actionParams);
    return actionResponse;
  }
  
  revisePubItems(actionParams: ifs.RevisePubItemsParams): Observable<ifs.RevisePubItemsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.RevisePubItemsParams> = of(actionParams);
    return actionResponse;
  }

  releasePubItems(actionParams: ifs.ReleasePubItemsParams): Observable<ifs.ReleasePubItemsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ReleasePubItemsParams> = of(actionParams);
    return actionResponse;
  }

  withdrawPubItems(actionParams: ifs.WithdrawPubItemsParams): Observable<ifs.WithdrawPubItemsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.WithdrawPubItemsParams> = of(actionParams);
    return actionResponse;
  }

  changeContext(actionParams: ifs.ChangeContextParams): Observable<ifs.ChangeContextParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeContextParams> = of(actionParams);
    return actionResponse;
  }
  
  addLocalTags(actionParams: ifs.AddLocalTagsParams): Observable<ifs.AddLocalTagsParams> {
    //console.log(`{\"localTags\": ${JSON.stringify(actionParams.localTags)}}`);
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.AddLocalTagsParams> = of(actionParams);
    return actionResponse;
  } 

  changeLocalTags(actionParams: ifs.ChangeLocalTagParams): Observable<ifs.ChangeLocalTagParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeLocalTagParams> = of(actionParams);
    return actionResponse;
  } 

  changeGenre(actionParams: ifs.ChangeGenreParams): Observable<ifs.ChangeGenreParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeGenreParams> = of(actionParams);
    return actionResponse;
  }

  changeFileVisibility(actionParams: ifs.ChangeFileVisibilityParams): Observable<ifs.ChangeFileVisibilityParams> {  
    //console.log(`{\"userAccountIpRange\": ${JSON.stringify(actionParams.localTags)}}`);
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeFileVisibilityParams> = of(actionParams);
    return actionResponse;
  }

  changeFileContentCategory(actionParams: ifs.ChangeFileContentCategoryParams): Observable<ifs.ChangeFileContentCategoryParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeFileContentCategoryParams> = of(actionParams);
    return actionResponse;
  }

  replaceFileAudience(actionParams: ifs.ReplaceFileAudienceParams): Observable<ifs.ReplaceFileAudienceParams> {
    //console.log(`{\"audiences\": ${JSON.stringify(this.audiences)}}`);
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ReplaceFileAudienceParams> = of(actionParams);
    return actionResponse;
  }

  changeExternalReferenceContentCategory(actionParams: ifs.ChangeExternalReferenceContentCategoryParams): Observable<ifs.ChangeExternalReferenceContentCategoryParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeExternalReferenceContentCategoryParams> = of(actionParams);
    return actionResponse;
  }

  replaceOrcid(actionParams: ifs.ReplaceOrcidParams): Observable<ifs.ReplaceOrcidParams> {
    console.log(`Authorization: ${this.token}`);
    //console.log(`{\"itemIds\": ${JSON.stringify(this.items)}}`);
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ReplaceOrcidParams> = of(actionParams);
    return actionResponse;
  } 

  changeReviewMethod(actionParams: ifs.ChangeReviewMethodParams): Observable<ifs.ChangeReviewMethodParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeReviewMethodParams> = of(actionParams);
    return actionResponse;
  }

  addKeywords(actionParams: ifs.AddKeywordsParams): Observable<ifs.AddKeywordsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.AddKeywordsParams> = of(actionParams);
    return actionResponse;
  }

  replaceKeywords(actionParams: ifs.ReplaceKeywordsParams): Observable<ifs.ReplaceKeywordsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ReplaceKeywordsParams> = of(actionParams);
    return actionResponse;
  }

  changeKeywords(actionParams: ifs.ChangeKeywordsParams): Observable<ifs.ChangeKeywordsParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeKeywordsParams> = of(actionParams);
    return actionResponse;
  }

  changeSourceGenre(actionParams: ifs.ChangeSourceGenreParams): Observable<ifs.ChangeSourceGenreParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeSourceGenreParams> = of(actionParams);
    return actionResponse;
  }

  replaceSourceEdition(actionParams: ifs.ReplaceSourceEditionParams): Observable<ifs.ReplaceSourceEditionParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ReplaceSourceEditionParams> = of(actionParams);
    return actionResponse;
  }

  addSourceIdentifer(actionParams: ifs.AddSourceIdentiferParams): Observable<ifs.AddSourceIdentiferParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.AddSourceIdentiferParams> = of(actionParams);
    return actionResponse;
  }
  
  changeSourceIdentifier(actionParams: ifs.ChangeSourceIdentifierParams): Observable<ifs.ChangeSourceIdentifierParams> {
    actionParams.itemIds = this.items;
    const actionResponse: Observable<ifs.ChangeSourceIdentifierParams> = of(actionParams);
    return actionResponse;
  }
}
