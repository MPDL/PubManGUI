import { Injectable } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const validateEvent = 'validateEvent';
const validateCreator = 'validateCreator';

@Injectable({
  providedIn: 'root'
})
export class ValidationService extends PubmanGenericRestClientService<any> {

  constructor(httpClient: HttpClient) {
    super('/validation', httpClient);
  }

  validateEvent(eventJson: any): Observable<any> {
    console.log('validateEvent validationService');
    console.log('eventJson', eventJson);
    return this.httpPostJson(this.subPath + '/' + validateEvent, eventJson);
  }

  validateCreator(creatorJson: any): Observable<any> {
    console.log('validateCreator validationService');
    console.log('creatorJson', creatorJson);
    return this.httpPostJson(this.subPath + '/' + validateCreator, creatorJson);
  }
}

