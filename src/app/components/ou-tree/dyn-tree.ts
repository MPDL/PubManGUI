import { Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class FlatNode<T> {
    constructor(
        public item: T,
        public level: number,
        public hasChildren: boolean = false,
        public isLoading: boolean = false
    ) { }
}

export abstract class Database<T> {

    initialData(): Observable<FlatNode<T>[]> {
        return this.getRootLevelItems().pipe(
            map(items => items.map((item: T) => new FlatNode<T>(item, 0, this.hasChildren(item))))
        );
    }

    abstract getRootLevelItems(): Observable<T[]>;

    abstract getChildren(item: T): Observable<T[]>;

    abstract hasChildren(item: T): boolean;
}

@Injectable()
export class DynamicDataSource<T> implements DataSource<FlatNode<T>> {

    dataChange: BehaviorSubject<FlatNode<T>[]> = new BehaviorSubject<FlatNode<T>[]>([]);

    get data(): FlatNode<T>[] { return this.dataChange.value; }
    set data(value: FlatNode<T>[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private treeControl: DynamicFlatTreeControl<T>,
        private database: Database<T>) { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    disconnect(collectionViewer: CollectionViewer): void { }

    connect(collectionViewer: CollectionViewer): Observable<FlatNode<T>[]> {
        this.treeControl.expansionModel.changed.subscribe(change => {
            if ((change as SelectionChange<FlatNode<T>>).added ||
                (change as SelectionChange<FlatNode<T>>).removed) {
                this.handleTreeControl(change as SelectionChange<FlatNode<T>>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<FlatNode<T>>) {
        if (change.added) {
            change.added.forEach((node) => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.reverse().forEach((node) => this.toggleNode(node, false));
        }
    }

    toggleNode(node: FlatNode<T>, expand: boolean) {
        node.isLoading = true;
        const children = this.database.getChildren(node.item);
        const index = this.data.indexOf(node);
        if (!children || index < 0) {
            node.isLoading = false;
            return;
        }

        if (expand) {
            children.subscribe(items => {
                const nodes: FlatNode<T>[] = [];
                items.forEach(item => nodes.push(
                    new FlatNode<T>(item, node.level + 1, this.database.hasChildren(item))
                ));
                this.data.splice(index + 1, 0, ...nodes);
                this.dataChange.next(this.data);
                node.isLoading = false;
            });
        } else {
            const count = this.countInvisibleDescendants(node);
            this.data.splice(index + 1, count);
            this.dataChange.next(this.data);
            node.isLoading = false;
        }
    }

    countInvisibleDescendants(node: FlatNode<T>): number {
        let count = 0;
        if (!this.treeControl.isExpanded(node)) {
            this.treeControl.getDescendants(node).map(child => {
                count += 1 + this.countInvisibleDescendants(child);
            });
        }
        return count;
    }

}

export class DynamicFlatTreeControl<T> extends FlatTreeControl<FlatNode<T>> {
    constructor() {
        super(
            (node: FlatNode<T>) => node.level,
            (node: FlatNode<T>) => node.hasChildren);
    }
}
