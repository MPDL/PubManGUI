import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {

  $currentQuery = new BehaviorSubject<object | undefined>(undefined)

  constructor() {
    const lastQuery = localStorage.getItem("last_search_query");
    if(lastQuery)
    {
      this.$currentQuery.next(JSON.parse(lastQuery) as object);
    }
    this.$currentQuery.subscribe((query) => {
      if (query) {
        localStorage.setItem("last_search_query", JSON.stringify(query));
      }
    })
  }
}
