import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {

  $currentQuery = new BehaviorSubject<object | undefined>(undefined)

  constructor() { }
}
