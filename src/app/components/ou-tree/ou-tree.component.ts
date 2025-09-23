import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Database, DynamicDataSource, DynamicFlatTreeControl, FlatNode } from './dyn-tree';
import { NgClass } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';
import { environment } from 'src/environments/environment';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OuModalComponent } from 'src/app/components/shared/ou-modal/ou-modal.component';

@Injectable()
export class OUsDatabase extends Database<any> {

  inge_uri = environment.inge_rest_uri;

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  getRootLevelItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.inge_uri}/ous/toplevel`).pipe(
      map(nodes => nodes)
    );
  }

  getChildren(item: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.inge_uri}/ous/${item.objectId}/children`).pipe(
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
  imports: [CdkTreeModule, NgClass]
})
export class OuTreeComponent {

  treeControl: DynamicFlatTreeControl<any>;
  dataSource: DynamicDataSource<any>;

  constructor(database: OUsDatabase, private modalService: NgbModal) {
    this.treeControl = new DynamicFlatTreeControl<any>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);
    database.initialData().subscribe(
      nodes => this.dataSource.data = nodes
    )
  }

  hasChildren = (_: number, nodeData: FlatNode<any>) => nodeData.hasChildren;

  info(node: any) {
    const componentInstance = this.modalService.open(OuModalComponent, { size: 'lg' }).componentInstance;
    componentInstance.ouId = node.item.objectId;
    console.log(JSON.stringify(node)); 
  }
}
