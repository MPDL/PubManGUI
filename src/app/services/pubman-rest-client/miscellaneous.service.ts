import { inject, Injectable, signal } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';
import { AaService } from '../aa.service';

@Injectable({
  providedIn: 'root'
})
export class MiscellaneousService extends PubmanGenericRestClientService<any> {
  ipListPath = 'getIpList';

  private aaService = inject(AaService);

  constructor(aaService: AaService) {
    super('/miscellaneous');
  }

  retrieveIpList(): Observable<IpEntry[]> {
    return this.httpGet(this.subPath + '/' + this.ipListPath, this.aaService.token ? this.aaService.token : undefined);
  }
}

export interface IpEntry {
  name: string,
  id: string,
  ipRanges: string[];
}
