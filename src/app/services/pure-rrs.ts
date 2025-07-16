import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
  UrlSerializer
} from "@angular/router";

@Injectable()
export class PureRrs extends RouteReuseStrategy {

    constructor(private serializer: UrlSerializer) {
        super();
    }

    private handleMap = new Map<string, DetachedRouteHandle>();

    private getKey(route: ActivatedRouteSnapshot): string {
        const key = this.serializer.serialize(createUrlTreeFromSnapshot(route, ['.']));
        // return route.pathFromRoot.filter(u => u.url).map(u => u.url).join('/');
        return key;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data['saveComponent'];
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const key = this.getKey(route);
        this.handleMap.set(key, handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return this.handleMap.has(this.getKey(route));
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        const handle = this.handleMap.get(this.getKey(route));
        if (handle) return handle;
        return {};
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
        /*
        if (future.routeConfig === curr.routeConfig) {
            return !future.data.alwaysRefresh;
        } else {
            return false;
        }
        */
    }

    public clearHandles(key: string): void {

        const handle = this.handleMap.get(key);

        if (handle) {
            (handle as any).componentRef.destroy();
        }

        this.handleMap.delete(key);
    }
}
