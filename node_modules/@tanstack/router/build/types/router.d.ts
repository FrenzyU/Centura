import { Store } from '@tanstack/store';
import { GetFrameworkGeneric } from './frameworks';
import { LinkInfo, LinkOptions, NavigateOptions, ToOptions, ValidFromPath, ResolveRelativePath } from './link';
import { AnyRoute, Route } from './route';
import { AnyPathParams, AnyRouteConfig, AnySearchSchema, LoaderContext, RouteConfig, SearchFilter } from './routeConfig';
import { AllRouteInfo, AnyAllRouteInfo, RouteInfo, RoutesById } from './routeInfo';
import { RouteMatch, RouteMatchStore } from './routeMatch';
import { NoInfer, PickAsRequired, Timeout, Updater } from './utils';
import { RouterHistory } from './history';
export interface RegisterRouter {
}
export type AnyRouter = Router<any, any, any>;
export type RegisteredRouter = RegisterRouter extends {
    router: Router<infer TRouteConfig, infer TAllRouteInfo, infer TRouterContext>;
} ? Router<TRouteConfig, TAllRouteInfo, TRouterContext> : Router;
export type RegisteredAllRouteInfo = RegisterRouter extends {
    router: Router<infer TRouteConfig, infer TAllRouteInfo, infer TRouterContext>;
} ? TAllRouteInfo : AnyAllRouteInfo;
export interface LocationState {
}
export interface ParsedLocation<TSearchObj extends AnySearchSchema = {}, TState extends LocationState = LocationState> {
    href: string;
    pathname: string;
    search: TSearchObj;
    searchStr: string;
    state: TState;
    hash: string;
    key?: string;
}
export interface FromLocation {
    pathname: string;
    search?: unknown;
    key?: string;
    hash?: string;
}
export type SearchSerializer = (searchObj: Record<string, any>) => string;
export type SearchParser = (searchStr: string) => Record<string, any>;
export type FilterRoutesFn = <TRoute extends Route<any, RouteInfo>>(routeConfigs: TRoute[]) => TRoute[];
export interface RouterOptions<TRouteConfig extends AnyRouteConfig, TRouterContext> {
    history?: RouterHistory;
    stringifySearch?: SearchSerializer;
    parseSearch?: SearchParser;
    filterRoutes?: FilterRoutesFn;
    defaultPreload?: false | 'intent';
    defaultPreloadDelay?: number;
    defaultComponent?: GetFrameworkGeneric<'Component'>;
    defaultErrorComponent?: GetFrameworkGeneric<'ErrorComponent'>;
    defaultPendingComponent?: GetFrameworkGeneric<'Component'>;
    defaultLoaderMaxAge?: number;
    defaultLoaderGcMaxAge?: number;
    caseSensitive?: boolean;
    routeConfig?: TRouteConfig;
    basepath?: string;
    Router?: (router: AnyRouter) => void;
    createRoute?: (opts: {
        route: AnyRoute;
        router: AnyRouter;
    }) => void;
    context?: TRouterContext;
    loadComponent?: (component: GetFrameworkGeneric<'Component'>) => Promise<GetFrameworkGeneric<'Component'>>;
    onRouteChange?: () => void;
    fetchServerDataFn?: FetchServerDataFn;
}
type FetchServerDataFn = (ctx: {
    router: AnyRouter;
    routeMatch: RouteMatch;
}) => Promise<any>;
export interface LoaderState<TFullSearchSchema extends AnySearchSchema = {}, TAllParams extends AnyPathParams = {}> {
    loadedAt: number;
    loaderContext: LoaderContext<TFullSearchSchema, TAllParams>;
}
export interface RouterStore<TSearchObj extends AnySearchSchema = {}, TState extends LocationState = LocationState> {
    status: 'idle' | 'pending';
    latestLocation: ParsedLocation<TSearchObj, TState>;
    currentMatches: RouteMatch[];
    currentLocation: ParsedLocation<TSearchObj, TState>;
    pendingMatches?: RouteMatch[];
    pendingLocation?: ParsedLocation<TSearchObj, TState>;
    lastUpdated: number;
}
export type ListenerFn = () => void;
export interface BuildNextOptions {
    to?: string | number | null;
    params?: true | Updater<unknown>;
    search?: true | Updater<unknown>;
    hash?: true | Updater<string>;
    state?: LocationState;
    key?: string;
    from?: string;
    fromCurrent?: boolean;
    __preSearchFilters?: SearchFilter<any>[];
    __postSearchFilters?: SearchFilter<any>[];
}
export type MatchCacheEntry = {
    gc: number;
    match: RouteMatch;
};
export interface MatchLocation {
    to?: string | number | null;
    fuzzy?: boolean;
    caseSensitive?: boolean;
    from?: string;
    fromCurrent?: boolean;
}
export interface MatchRouteOptions {
    pending?: boolean;
    caseSensitive?: boolean;
    fuzzy?: boolean;
}
export interface DehydratedRouterState extends Pick<RouterStore, 'status' | 'latestLocation' | 'currentLocation' | 'lastUpdated'> {
    currentMatches: DehydratedRouteMatch[];
}
export interface DehydratedRouter<TRouterContext = unknown> {
    state: DehydratedRouterState;
    context: TRouterContext;
}
export type MatchCache = Record<string, MatchCacheEntry>;
interface DehydratedRouteMatch {
    id: string;
    state: Pick<RouteMatchStore<any, any>, 'status'>;
}
export interface RouterContext {
}
export declare const defaultFetchServerDataFn: FetchServerDataFn;
export declare class Router<TRouteConfig extends AnyRouteConfig = RouteConfig, TAllRouteInfo extends AnyAllRouteInfo = AllRouteInfo<TRouteConfig>, TRouterContext = unknown> {
    #private;
    types: {
        RouteConfig: TRouteConfig;
        AllRouteInfo: TAllRouteInfo;
    };
    options: PickAsRequired<RouterOptions<TRouteConfig, TRouterContext>, 'stringifySearch' | 'parseSearch' | 'context'>;
    history: RouterHistory;
    basepath: string;
    routeTree: Route<TAllRouteInfo, RouteInfo>;
    routesById: RoutesById<TAllRouteInfo>;
    navigateTimeout: undefined | Timeout;
    nextAction: undefined | 'push' | 'replace';
    navigationPromise: undefined | Promise<void>;
    store: Store<RouterStore<TAllRouteInfo['fullSearchSchema']>>;
    startedLoadingAt: number;
    resolveNavigation: () => void;
    constructor(options?: RouterOptions<TRouteConfig, TRouterContext>);
    reset: () => void;
    mount: () => () => void;
    update: <TRouteConfig_1 extends RouteConfig<string, string, string, string, {}, {}, {}, {}, {}, {}, unknown> = RouteConfig<string, string, string, string, {}, {}, {}, {}, {}, {}, unknown>, TAllRouteInfo_1 extends AnyAllRouteInfo = AllRouteInfo<TRouteConfig_1>, TRouterContext_1 = unknown>(opts?: RouterOptions<TRouteConfig_1, TRouterContext_1> | undefined) => Router<TRouteConfig_1, TAllRouteInfo_1, TRouterContext_1>;
    buildNext: (opts: BuildNextOptions) => ParsedLocation<{}, LocationState>;
    cancelMatches: () => void;
    load: (next?: ParsedLocation) => Promise<void>;
    getRoute: <TId extends keyof TAllRouteInfo["routeInfoById"]>(id: TId) => Route<TAllRouteInfo, TAllRouteInfo["routeInfoById"][TId], unknown>;
    loadRoute: (navigateOpts?: BuildNextOptions) => Promise<RouteMatch[]>;
    preloadRoute: (navigateOpts?: BuildNextOptions) => Promise<RouteMatch<import("./routeInfo").DefaultAllRouteInfo, RouteInfo<string, string, string, "/", {}, {}, {}, {}, {}, {}>>[]>;
    matchRoutes: (pathname: string, opts?: {
        strictParseParams?: boolean;
    }) => RouteMatch<import("./routeInfo").DefaultAllRouteInfo, RouteInfo<string, string, string, "/", {}, {}, {}, {}, {}, {}>>[];
    loadMatches: (resolvedMatches: RouteMatch[], loaderOpts?: {
        preload?: boolean;
    }) => Promise<void>;
    reload: () => void;
    resolvePath: (from: string, path: string) => string;
    navigate: <TFrom extends ValidFromPath<TAllRouteInfo> = "/", TTo extends string = ".">({ from, to, search, hash, replace, params, }: NavigateOptions<TAllRouteInfo, TFrom, TTo>) => Promise<void>;
    matchRoute: <TFrom extends ValidFromPath<TAllRouteInfo> = "/", TTo extends string = ".">(location: ToOptions<TAllRouteInfo, TFrom, TTo, ResolveRelativePath<TFrom, NoInfer<TTo>>>, opts?: MatchRouteOptions) => false | TAllRouteInfo["routeInfoById"][ResolveRelativePath<TFrom, NoInfer<TTo>>]["allParams"];
    buildLink: <TFrom extends ValidFromPath<TAllRouteInfo> = "/", TTo extends string = ".">({ from, to, search, params, hash, target, replace, activeOptions, preload, preloadMaxAge: userPreloadMaxAge, preloadGcMaxAge: userPreloadGcMaxAge, preloadDelay: userPreloadDelay, disabled, }: LinkOptions<TAllRouteInfo, TFrom, TTo>) => LinkInfo;
    dehydrate: () => DehydratedRouter<TRouterContext>;
    hydrate: (dehydratedRouter: DehydratedRouter<TRouterContext>) => void;
}
export {};
