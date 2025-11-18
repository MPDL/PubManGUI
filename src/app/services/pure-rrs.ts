import {RouteReuseStrategy, Route, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class PureRrs implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Determines if a route should be stored for later reuse
    return route.data['saveComponent'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Stores the detached route handle when shouldDetach returns true
    if (handle && route.data['saveComponent'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Checks if a stored route should be reattached
    const key = this.getRouteKey(route);
    return route.data['saveComponent'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Returns the stored route handle for reattachment
    const key = this.getRouteKey(route);
    return route.data['saveComponent'] === true ? this.handlers.get(key) ?? null : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Determines if the router should reuse the current route instance
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }

  public clearHandles(key: any): void {
    const handle = this.handlers.get(key);
    if (handle) {
      (handle as any).componentRef.destroy();
    }
    this.handlers.delete(key);
  }

  public clearAllHandles(): void {
    for (const handleKey of this.handlers.keys()) {
      this.clearHandles(handleKey)
    }

  }
}
