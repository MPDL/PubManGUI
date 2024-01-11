import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Database, DynamicDataSource, FlatNode, DynamicFlatTreeControl } from './dyn-tree';
import { NgClass, NgIf } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';

@Injectable()
 export class OUsDatabase extends Database<any> {

  pure_live = 'https://pure.mpg.de/rest/';
  pure_local = 'http://localhost:8080/rest/';

  constructor (
    private http: HttpClient
  ) {
    super();
  }

  getRootLevelItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.pure_live}ous/toplevel`).pipe(
      map(nodes => nodes)
    );
  }

  getChildren(item: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.pure_live}ous/${item.objectId}/children`).pipe(
      map(ous => ous)
    );
  }

  hasChildren(item: any): boolean {
    return item.hasChildren;
  }
}

@Component({
    selector: 'pure-dyn-tree',
    templateUrl: './ou-tree.component.html',
    styleUrls: ['./ou-tree.component.scss'],
    providers: [OUsDatabase],
    standalone: true,
    imports: [CdkTreeModule, NgClass, NgIf]
})
export class OuTreeComponent {

  treeControl: DynamicFlatTreeControl<any>;
  dataSource: DynamicDataSource<any>;

  constructor(database: OUsDatabase) {
    this.treeControl = new DynamicFlatTreeControl<any>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);
    database.initialData().subscribe(
      nodes => this.dataSource.data = nodes
    )
  }

  hasChildren = (_: number, nodeData: FlatNode<any>) => nodeData.hasChildren;

  info(node: any) {
    if (!node.hasChildren) {
      alert(JSON.stringify(node, null, 4));
    }
  }
}
