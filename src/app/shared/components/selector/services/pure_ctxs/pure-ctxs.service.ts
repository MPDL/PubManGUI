import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ElseService } from 'src/app/shared/services/else.service';
import { ctxs_suggest } from 'src/app/model/pure_queries';
import { SelectedValue } from '../selector-datasource.service';

export interface Ctx extends SelectedValue {
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class PureCtxsService {

  constructor(
    private elastic: ElseService,
  ) { }

  getOUs(val: string) {
    return this.elastic.post('/find', ctxs_suggest(val), undefined).pipe(
      map(response => {
        const hits = response.hits.hits;
        const fields = hits.map((hit: any) => hit.fields);
        const ctxs: Ctx[] = fields.map((f: any) => {
          const ctx: Ctx = { selected: '', id: '' };
          ctx.id = f.objectId[0];
          ctx.selected = f.name[0];
          return ctx;
        });
        return ctxs;
      }))
  }
}
