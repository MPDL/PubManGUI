import { inject, Injectable } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { AaService } from '../aa.service';
import { Observable, throwError } from 'rxjs';
import { C } from '@angular/cdk/focus-monitor.d-810a02e6';

const validateEventTitleRequired = 'validateEventTitleRequired';

@Injectable({
  providedIn: 'root'
})
export class ValidationService extends PubmanGenericRestClientService<any> {

  private aaService = inject(AaService);

  constructor() {
    super('/validation');
  }

  validateEvent(eventJson: JSON): Observable<any>{
    console.log('validateEvent validationService')
    console.log('eventJson', eventJson);
    return this.httpPost(this.subPath + '/'+ validateEventTitleRequired, eventJson);
  }
}

