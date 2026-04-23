import { HttpClient } from '@angular/common/http';
import { Component, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Database, DynamicDataSource, DynamicFlatTreeControl, FlatNode } from './dyn-tree';
import { NgClass } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';
import { environment } from 'src/environments/environment';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OuModalComponent } from 'src/app/components/shared/ou-modal/ou-modal.component';
import { AaService } from 'src/app/services/aa.service';
import { MatomoTracker } from 'ngx-matomo-client';
import { ItemVersionState } from 'src/app/model/inge';
import { baseElasticSearchQueryBuilder } from 'src/app/utils/search-utils';
import { SearchStateService } from '../search-result-list/search-state.service';
import { Router } from '@angular/router';

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
      map(nodes => nodes));
  }

  getChildren(item: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.inge_uri}/ous/${item.objectId}/children`).pipe(
      map(ous => ous.sort(this.sortByStatus()))
    );
  }

  hasChildren(item: any): boolean {
    return item.hasChildren;
  }

  sortByStatus() {
    return function (a: any, b: any) {
      if (a['publicStatus'] > b['publicStatus']) return -1;
      if (a['publicStatus'] < b['publicStatus']) return 1;

      if (a['name'] < b['name']) return -1;
      if (a['name'] > b['name']) return 1;

      return 0;
    }
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
  aaService = inject(AaService);
  matomoTracker = inject(MatomoTracker);
  searchState = inject(SearchStateService);
  router = inject(Router);

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

  searchForOu(node: any) {
    const ouId = node.item.objectId;
    // search(searchString:string|undefined|null): void {

    if (ouId) {
      const filterOutQuery = this.aaService.filterOutQuery([ItemVersionState.PENDING, ItemVersionState.SUBMITTED, ItemVersionState.IN_REVISION]);
      const query = {
        bool: {
          must: [{
            term: {
              "metadata.creators.person.organizations.identifierPath": ouId
            }
          }],
          must_not: [
            baseElasticSearchQueryBuilder({ index: "publicState", type: "keyword" }, "WITHDRAWN"),
            ...(filterOutQuery ? [filterOutQuery] : [])
          ]
        }
      };
      this.matomoTracker.trackSiteSearch(ouId, "ou-tree");

      this.searchState.$currentQuery.next(query);
      //sessionStorage.setItem('currentQuery', JSON.stringify(query));
      this.router.navigateByUrl('/search');
    }

  }

}
