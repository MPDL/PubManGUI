import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { term_filter, AggregationParams } from '../model/aggs-params';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {

  searchUrl = environment.else_rest_url.concat('/find');
  pure_search = 'https://pure.mpg.de/rest/items/elasticsearch';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  getBuckets(index_name: string, aggregation: any) {
    const params: AggregationParams = {
      index: index_name,
      size: 0,
      aggregations: aggregation
    };
    return this.http.post(this.searchUrl, params, this.httpOptions).pipe(
      map(response => {
        return this.findByKey(response, 'buckets');
      })
    );
  }

  getBuckets_from_pure(aggregation: any) {
    const params = {
      size: 0,
      aggregations: aggregation
    };
    return this.http.post(this.pure_search, params, this.httpOptions).pipe(
      map(response => {
        return this.findByKey(response, 'buckets');
      })
    );
  }

  termfilter(i: string, f: string, v: string) {
    term_filter.index = i;
    term_filter.query.term = { [f]: v };
    return this.http.post<any>(this.searchUrl, term_filter, this.httpOptions).pipe(
      map(response => response),
    );
  }

  findByKey = (obj: any, key2find: string) => {
    if (key2find in obj) return obj[key2find];
    for (const v of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
      const found: any = this.findByKey(v, key2find);
      if (found) return found;
    }
  }
}
