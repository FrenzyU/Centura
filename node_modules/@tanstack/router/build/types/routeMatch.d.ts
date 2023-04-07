import { Store } from '@tanstack/store';
import { GetFrameworkGeneric } from './frameworks';
import { Route } from './route';
import { AnyAllRouteInfo, AnyRouteInfo, DefaultAllRouteInfo, RouteInfo } from './routeInfo';
import { AnyRouter, Router } from './router';
import { Expand } from './utils';
export interface RouteMatchStore<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TRouteInfo extends AnyRouteInfo = RouteInfo> {
    routeSearch: TRouteInfo['searchSchema'];
    search: Expand<TAllRouteInfo['fullSearchSchema'] & TRouteInfo['fullSearchSchema']>;
    status: 'idle' | 'pending' | 'success' | 'error';
    error?: unknown;
    updatedAt: number;
}
export declare class RouteMatch<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TRouteInfo extends AnyRouteInfo = RouteInfo> {
    #private;
    route: Route<TAllRouteInfo, TRouteInfo>;
    router: Router<TAllRouteInfo['routeConfig'], TAllRouteInfo>;
    store: Store<RouteMatchStore<TAllRouteInfo, TRouteInfo>>;
    id: string;
    pathname: string;
    params: TRouteInfo['allParams'];
    component: GetFrameworkGeneric<'Component'>;
    errorComponent: GetFrameworkGeneric<'ErrorComponent'>;
    pendingComponent: GetFrameworkGeneric<'Component'>;
    abortController: AbortController;
    onLoaderDataListeners: Set<() => void>;
    parentMatch?: RouteMatch;
    __loadPromise?: Promise<void>;
    __onExit?: void | ((matchContext: {
        params: TRouteInfo['allParams'];
        search: TRouteInfo['fullSearchSchema'];
    }) => void);
    constructor(router: AnyRouter, route: Route<TAllRouteInfo, TRouteInfo>, opts: {
        id: string;
        params: TRouteInfo['allParams'];
        pathname: string;
    });
    cancel: () => void;
    load: () => Promise<void>;
    fetch: () => Promise<void>;
    __setParentMatch: (parentMatch?: RouteMatch) => void;
    __validate: () => void;
}
