import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ou_suggest } from 'src/app/model/pure_queries';
import { SelectedValue } from '../selector-datasource.service';
import { OrganizationsService } from "../../../../../services/pubman-rest-client/organizations.service";

export interface OU extends SelectedValue {
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class PureOusService {

  constructor(
    private service: OrganizationsService,
  ) { }

  getOUs(val: string) {
    return this.service.elasticSearch(ou_suggest(val)).pipe(
      map(response => {
        const hits = response.hits.hits;
        const fields = hits.map((hit: any) => hit.fields);
        const ous: OU[] = fields.map((f: any) => {
          const ou: OU = { selected: '', id: '' };
          ou.id = f.objectId[0];
          if (f?.mother && f.mother[0]['parentAffiliation.name']) {
            ou.selected = f?.ou_chain[0].concat(' - ').concat(f.mother[0]['parentAffiliation.name'][0])
          } else {
            ou.selected = f?.ou_chain[0];
          }
          return ou;
        });
        return ous;
      }))
  }
}
