import { Injectable } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { BehaviorSubject, catchError, finalize, merge, Observable, of, Subscription } from 'rxjs';
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
        private database: Database<T>) {
        this.expansionSubscription = this.treeControl.expansionModel.changed.subscribe(change => {
            this.handleTreeControl(change as SelectionChange<FlatNode<T>>);
        });
    }

    private readonly expansionSubscription: Subscription;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    disconnect(_collectionViewer: CollectionViewer): void {
        this.expansionSubscription.unsubscribe();
    }

    connect(collectionViewer: CollectionViewer): Observable<FlatNode<T>[]> {
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
            children.pipe(
                catchError(() => of([] as T[])),
                finalize(() => {
                    node.isLoading = false;
                    this.dataChange.next(this.data);
                })
            ).subscribe(items => {
                const currentIndex = this.data.indexOf(node);
                if (currentIndex < 0) {
                    return;
                }

                const existingDescendants = this.getContiguousDescendants(node);
                if (existingDescendants.length > 0) {
                    this.data.splice(currentIndex + 1, existingDescendants.length);
                }

                const nodes: FlatNode<T>[] = [];
                items.forEach(item => nodes.push(
                    new FlatNode<T>(item, node.level + 1, this.database.hasChildren(item))
                ));
                this.data.splice(currentIndex + 1, 0, ...nodes);
                this.dataChange.next(this.data);
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

    private getContiguousDescendants(node: FlatNode<T>): FlatNode<T>[] {
        const descendants: FlatNode<T>[] = [];
        const nodeIndex = this.data.indexOf(node);
        if (nodeIndex < 0) {
            return descendants;
        }

        for (let i = nodeIndex + 1; i < this.data.length; i += 1) {
            const current = this.data[i];
            if (current.level <= node.level) {
                break;
            }
            descendants.push(current);
        }

        return descendants;
    }

}

export class DynamicFlatTreeControl<T> extends FlatTreeControl<FlatNode<T>> {
    constructor() {
        super(
            (node: FlatNode<T>) => node.level,
            (node: FlatNode<T>) => node.hasChildren);
    }
}
