import { Injectable } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';

const validateEventTitleRequired = 'validateEventTitleRequired';

@Injectable({
  providedIn: 'root'
})
export class ValidationService extends PubmanGenericRestClientService<any> {

  constructor() {
    super('/validation');
  }

  validateEvent(eventJson: any): Observable<any> {
    console.log('validateEvent validationService');
    console.log('eventJson', eventJson);
    return this.httpPost(this.subPath + '/' + validateEventTitleRequired, eventJson);/*.pipe(
      map(response => {
        // Assuming the response contains a status code
        if (response.status >= 400) {
          return { invalidEvent: true };
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Validation error:', error);
        return of({ invalidEvent: true });
      }),
      defaultIfEmpty(null) // Ensures that the observable emits null if it completes without emitting any values
    );*/
  }
}

