import { Injectable } from '@angular/core';
import { ItemVersionVO } from '../model/inge';
import { IngeCrudService } from './inge-crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends IngeCrudService{
  itemsPath: string = '/items';
  
  getItem(itemId: string, token?: string): Observable<ItemVersionVO>{
    const path = this.itemsPath + '/' + itemId;
    if(token) {
      return this.get(path, token);
    } else {
      return this.get(path);
    }
  }

  createItem(item: ItemVersionVO, token: string): Observable<ItemVersionVO> {
    return this.post(this.itemsPath, item, token);
  }

  updateItem(item: ItemVersionVO, token: string): Observable<ItemVersionVO> {
    const path = this.itemsPath + '/' + item.objectId
    
    return this.put(path, item, token);
  }

  deleteItem(item: ItemVersionVO, token: string ): Observable<Number>{
    const path = this.itemsPath + '/' + item.objectId;
    return this.delete(path, null, token);
  }
}
