import { HttpClient } from '@angular/common/http';
import { DOCUMENT, Component, inject, Injectable, ChangeDetectionStrategy } from '@angular/core';
import { map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Database, DynamicDataSource, DynamicFlatTreeControl, FlatNode } from './dyn-tree';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';
import { environment } from 'src/environments/environment';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OuModalComponent } from 'src/app/components/shared/ou-modal/ou-modal.component';
import { AaService } from 'src/app/services/aa.service';
import { MatomoTracker } from 'ngx-matomo-client';
import { AffiliationDbVO, ItemVersionState } from 'src/app/model/inge';
import { baseElasticSearchQueryBuilder } from 'src/app/utils/search-utils';
import { SearchStateService } from '../search-result-list/search-state.service';
import { Router } from '@angular/router';
import { DestroyRef } from '@angular/core';

@Injectable()
export class OUsDatabase extends Database<AffiliationDbVO> {

  private readonly ingeUri = environment.inge_rest_uri;

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  getRootLevelItems(): Observable<AffiliationDbVO[]> {
    return this.http.get<AffiliationDbVO[]>(`${this.ingeUri}/ous/toplevel`);
  }

  getChildren(item: AffiliationDbVO): Observable<AffiliationDbVO[]> {
    return this.http.get<AffiliationDbVO[]>(`${this.ingeUri}/ous/${item.objectId}/children`).pipe(
      map(ous => [...ous].sort(OUsDatabase.compareByStatus))
    );
  }

  hasChildren(item: AffiliationDbVO): boolean {
    return item.hasChildren;
  }

  private static compareByStatus(a: AffiliationDbVO, b: AffiliationDbVO): number {
    if (a.publicStatus > b.publicStatus) return -1;
    if (a.publicStatus < b.publicStatus) return 1;

    if ((a.name ?? '') < (b.name ?? '')) return -1;
    if ((a.name ?? '') > (b.name ?? '')) return 1;

    return 0;
  }
}

@Component({
  selector: 'pure-dyn-tree',
  templateUrl: './ou-tree.component.html',
  styleUrls: ['./ou-tree.component.scss'],
  providers: [OUsDatabase],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTreeModule, NgClass, NgTemplateOutlet]
})
export class OuTreeComponent {
  aaService = inject(AaService);
  matomoTracker = inject(MatomoTracker);
  searchState = inject(SearchStateService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  treeControl: DynamicFlatTreeControl<AffiliationDbVO>;
  dataSource: DynamicDataSource<AffiliationDbVO>;

  private static readonly EXPANDED_STATE_KEY = 'ou-tree-expanded-ous';
  private readonly document = inject(DOCUMENT);
  private restoreScheduled = false;

  constructor(database: OUsDatabase, private modalService: NgbModal) {
    this.treeControl = new DynamicFlatTreeControl<AffiliationDbVO>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);

    // Persist the set of expanded node ids for the current session whenever the expansion state changes.
    this.treeControl.expansionModel.changed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const expandedIds = this.treeControl.expansionModel.selected
          .map(node => node?.item?.objectId)
          .filter(id => !!id);
        this.storage?.setItem(OuTreeComponent.EXPANDED_STATE_KEY, JSON.stringify(expandedIds));
      });

    this.dataSource.dataChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.scheduleExpandedStateRestore());

    database.initialData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(nodes => this.dataSource.data = nodes);
  }

  private get storage(): Storage | undefined {
    return this.document.defaultView?.sessionStorage;
  }

  private getPersistedExpandedIds(): Set<string> {
    const raw = this.storage?.getItem(OuTreeComponent.EXPANDED_STATE_KEY);
    if (!raw) {
      return new Set<string>();
    }
    try {
      return new Set<string>(JSON.parse(raw));
    } catch {
      return new Set<string>();
    }
  }

  private scheduleExpandedStateRestore(): void {
    if (this.restoreScheduled) {
      return;
    }

    this.restoreScheduled = true;
    setTimeout(() => {
      this.restoreScheduled = false;
      this.restoreExpandedState();
    });
  }

  private restoreExpandedState(): void {
    const expandedIds = this.getPersistedExpandedIds();
    if (expandedIds.size === 0) {
      return;
    }

    const toExpand = this.dataSource.data.filter(node =>
      node?.hasChildren &&
      node.item?.objectId &&
      expandedIds.has(node.item.objectId) &&
      !this.treeControl.isExpanded(node)
    );

    if (toExpand.length === 0) {
      return;
    }

    toExpand.forEach(node => this.treeControl.expansionModel.select(node));
  }

  hasChildren = (_: number, nodeData: FlatNode<AffiliationDbVO>) => nodeData.hasChildren;

  info(node: FlatNode<AffiliationDbVO>) {
    const componentInstance = this.modalService.open(OuModalComponent, { size: 'lg' }).componentInstance;
    componentInstance.ouId = node.item.objectId;
    // console.log(JSON.stringify(node));
  }

  searchForOu(node: FlatNode<AffiliationDbVO>) {
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
      // sessionStorage.setItem('currentQuery', JSON.stringify(query));
      this.router.navigateByUrl('/search');
    }

  }

}
