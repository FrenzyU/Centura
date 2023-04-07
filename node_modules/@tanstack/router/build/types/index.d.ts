/**
 * router
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
export { default as invariant } from 'tiny-invariant';
import { Store } from '@tanstack/store';

interface RouterHistory {
    location: RouterLocation;
    listen: (cb: () => void) => () => void;
    push: (path: string, state: any) => void;
    replace: (path: string, state: any) => void;
    go: (index: number) => void;
    back: () => void;
    forward: () => void;
}
interface ParsedPath {
    href: string;
    pathname: string;
    search: string;
    hash: string;
}
interface RouterLocation extends ParsedPath {
    state: any;
}
declare function createBrowserHistory(opts?: {
    getHref?: () => string;
    createHref?: (path: string) => string;
}): RouterHistory;
declare function createHashHistory(): RouterHistory;
declare function createMemoryHistory(opts?: {
    initialEntries: string[];
    initialIndex?: number;
}): RouterHistory;

interface FrameworkGenerics {
}
type GetFrameworkGeneric<U> = U extends keyof FrameworkGenerics ? FrameworkGenerics[U] : any;

type NoInfer<T> = [T][T extends any ? 0 : never];
type IsAny<T, Y, N> = 1 extends 0 & T ? Y : N;
type IsAnyBoolean<T> = 1 extends 0 & T ? true : false;
type IsKnown<T, Y, N> = unknown extends T ? N : Y;
type PickAsRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type PickAsPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type PickUnsafe<T, K> = K extends keyof T ? Pick<T, K> : never;
type PickExtra<T, K> = Expand<{
    [TKey in keyof K as string extends TKey ? never : TKey extends keyof T ? never : TKey]: K[TKey];
}>;
type PickRequired<T> = {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
type Expand<T> = T extends object ? T extends infer O ? {
    [K in keyof O]: O[K];
} : never : T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => any ? I : never;
type Values<O> = O[ValueKeys<O>];
type ValueKeys<O> = Extract<keyof O, PropertyKey>;
type DeepAwaited<T> = T extends Promise<infer A> ? DeepAwaited<A> : T extends Record<infer A, Promise<infer B>> ? {
    [K in A]: DeepAwaited<B>;
} : T;
type PathParamMask<TRoutePath extends string> = TRoutePath extends `${infer L}/$${infer C}/${infer R}` ? PathParamMask<`${L}/${string}/${R}`> : TRoutePath extends `${infer L}/$${infer C}` ? PathParamMask<`${L}/${string}`> : TRoutePath;
type Timeout = ReturnType<typeof setTimeout>;
type Updater<TPrevious, TResult = TPrevious> = TResult | ((prev?: TPrevious) => TResult);
type PickExtract<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
};
type PickExclude<T, U> = {
    [K in keyof T as T[K] extends U ? never : K]: T[K];
};
declare function last<T>(arr: T[]): T | undefined;
declare function warning(cond: any, message: string): cond is true;
declare function functionalUpdate<TResult>(updater: Updater<TResult>, previous: TResult): TResult;
declare function pick<T, K extends keyof T>(parent: T, keys: K[]): Pick<T, K>;
/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between immutable JSON values for example.
 * Do not use this with signals
 */
declare function replaceEqualDeep<T>(prev: any, _next: T): T;
declare function isPlainObject(o: any): boolean;

interface RegisterRouter {
}
type AnyRouter = Router<any, any, any>;
type RegisteredRouter = RegisterRouter extends {
    router: Router<infer TRouteConfig, infer TAllRouteInfo, infer TRouterContext>;
} ? Router<TRouteConfig, TAllRouteInfo, TRouterContext> : Router;
type RegisteredAllRouteInfo = RegisterRouter extends {
    router: Router<infer TRouteConfig, infer TAllRouteInfo, infer TRouterContext>;
} ? TAllRouteInfo : AnyAllRouteInfo;
interface LocationState {
}
interface ParsedLocation<TSearchObj extends AnySearchSchema = {}, TState extends LocationState = LocationState> {
    href: string;
    pathname: string;
    search: TSearchObj;
    searchStr: string;
    state: TState;
    hash: string;
    key?: string;
}
interface FromLocation {
    pathname: string;
    search?: unknown;
    key?: string;
    hash?: string;
}
type SearchSerializer = (searchObj: Record<string, any>) => string;
type SearchParser = (searchStr: string) => Record<string, any>;
type FilterRoutesFn = <TRoute extends Route<any, RouteInfo>>(routeConfigs: TRoute[]) => TRoute[];
interface RouterOptions<TRouteConfig extends AnyRouteConfig, TRouterContext> {
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
interface LoaderState<TFullSearchSchema extends AnySearchSchema = {}, TAllParams extends AnyPathParams = {}> {
    loadedAt: number;
    loaderContext: LoaderContext<TFullSearchSchema, TAllParams>;
}
interface RouterStore<TSearchObj extends AnySearchSchema = {}, TState extends LocationState = LocationState> {
    status: 'idle' | 'pending';
    latestLocation: ParsedLocation<TSearchObj, TState>;
    currentMatches: RouteMatch[];
    currentLocation: ParsedLocation<TSearchObj, TState>;
    pendingMatches?: RouteMatch[];
    pendingLocation?: ParsedLocation<TSearchObj, TState>;
    lastUpdated: number;
}
type ListenerFn = () => void;
interface BuildNextOptions {
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
type MatchCacheEntry = {
    gc: number;
    match: RouteMatch;
};
interface MatchLocation {
    to?: string | number | null;
    fuzzy?: boolean;
    caseSensitive?: boolean;
    from?: string;
    fromCurrent?: boolean;
}
interface MatchRouteOptions {
    pending?: boolean;
    caseSensitive?: boolean;
    fuzzy?: boolean;
}
interface DehydratedRouterState extends Pick<RouterStore, 'status' | 'latestLocation' | 'currentLocation' | 'lastUpdated'> {
    currentMatches: DehydratedRouteMatch[];
}
interface DehydratedRouter<TRouterContext = unknown> {
    state: DehydratedRouterState;
    context: TRouterContext;
}
type MatchCache = Record<string, MatchCacheEntry>;
interface DehydratedRouteMatch {
    id: string;
    state: Pick<RouteMatchStore<any, any>, 'status'>;
}
interface RouterContext {
}
declare const defaultFetchServerDataFn: FetchServerDataFn;
declare class Router<TRouteConfig extends AnyRouteConfig = RouteConfig, TAllRouteInfo extends AnyAllRouteInfo = AllRouteInfo<TRouteConfig>, TRouterContext = unknown> {
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
    preloadRoute: (navigateOpts?: BuildNextOptions) => Promise<RouteMatch<DefaultAllRouteInfo, RouteInfo<string, string, string, "/", {}, {}, {}, {}, {}, {}>>[]>;
    matchRoutes: (pathname: string, opts?: {
        strictParseParams?: boolean;
    }) => RouteMatch<DefaultAllRouteInfo, RouteInfo<string, string, string, "/", {}, {}, {}, {}, {}, {}>>[];
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

interface RouteMatchStore<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TRouteInfo extends AnyRouteInfo = RouteInfo> {
    routeSearch: TRouteInfo['searchSchema'];
    search: Expand<TAllRouteInfo['fullSearchSchema'] & TRouteInfo['fullSearchSchema']>;
    status: 'idle' | 'pending' | 'success' | 'error';
    error?: unknown;
    updatedAt: number;
}
declare class RouteMatch<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TRouteInfo extends AnyRouteInfo = RouteInfo> {
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

declare const rootRouteId: "__root__";
type RootRouteId = typeof rootRouteId;
type AnyLoaderData = {};
type AnyPathParams = {};
type AnySearchSchema = {};
interface RouteMeta {
}
type SearchSchemaValidator<TReturn, TParentSchema> = SearchSchemaValidatorObj<TReturn, TParentSchema> | SearchSchemaValidatorFn<TReturn, TParentSchema>;
type SearchSchemaValidatorObj<TReturn, TParentSchema> = {
    parse?: SearchSchemaValidatorFn<TReturn, TParentSchema>;
};
type SearchSchemaValidatorFn<TReturn, TParentSchema> = (searchObj: Record<string, unknown>) => {} extends TParentSchema ? TReturn : keyof TReturn extends keyof TParentSchema ? {
    error: 'Top level search params cannot be redefined by child routes!';
    keys: keyof TReturn & keyof TParentSchema;
} : TReturn;
type DefinedPathParamWarning = 'Path params cannot be redefined by child routes!';
type ParentParams<TParentParams> = AnyPathParams extends TParentParams ? {} : {
    [Key in keyof TParentParams]?: DefinedPathParamWarning;
};
type OnLoadFn<TFullSearchSchema extends AnySearchSchema = {}, TAllParams extends AnyPathParams = {}> = (loaderContext: LoaderContext<TFullSearchSchema, TAllParams>) => Promise<any> | void;
interface LoaderContext<TFullSearchSchema extends AnySearchSchema = {}, TAllParams extends AnyPathParams = {}> {
    params: TAllParams;
    search: TFullSearchSchema;
    signal?: AbortSignal;
}
type UnloaderFn<TPath extends string> = (routeMatch: RouteMatch<any, RouteInfo<string, TPath>>) => void;
type RouteOptions<TRouteId extends string = string, TPath extends string = string, TParentSearchSchema extends {} = {}, TSearchSchema extends AnySearchSchema = {}, TFullSearchSchema extends AnySearchSchema = TSearchSchema, TParentParams extends AnyPathParams = {}, TParams extends Record<ParsePathParams<TPath>, unknown> = Record<ParsePathParams<TPath>, string>, TAllParams extends AnyPathParams = {}> = ({
    path: TPath;
} | {
    id: TRouteId;
}) & {
    caseSensitive?: boolean;
    validateSearch?: SearchSchemaValidator<TSearchSchema, TParentSearchSchema>;
    preSearchFilters?: SearchFilter<TFullSearchSchema>[];
    postSearchFilters?: SearchFilter<TFullSearchSchema>[];
    component?: GetFrameworkGeneric<'Component'>;
    errorComponent?: GetFrameworkGeneric<'ErrorComponent'>;
    pendingComponent?: GetFrameworkGeneric<'Component'>;
    beforeLoad?: (opts: {
        router: AnyRouter;
        match: RouteMatch;
    }) => Promise<void> | void;
    onLoad?: OnLoadFn<TFullSearchSchema, TAllParams>;
    onLoadError?: (err: any) => void;
    onLoaded?: (matchContext: {
        params: TAllParams;
        search: TFullSearchSchema;
    }) => void | undefined | ((match: {
        params: TAllParams;
        search: TFullSearchSchema;
    }) => void);
    onTransition?: (match: {
        params: TAllParams;
        search: TFullSearchSchema;
    }) => void;
    meta?: RouteMeta;
} & ({
    parseParams?: never;
    stringifyParams?: never;
} | {
    parseParams: (rawParams: IsAny<TPath, any, Record<ParsePathParams<TPath>, string>>) => TParams;
    stringifyParams: (params: TParams) => Record<ParsePathParams<TPath>, string>;
}) & (PickUnsafe<TParentParams, ParsePathParams<TPath>> extends never ? {} : 'Cannot redefined path params in child routes!');
type SearchFilter<T, U = T> = (prev: T) => U;
interface RouteConfig<TId extends string = string, TRouteId extends string = string, TPath extends string = string, TFullPath extends string = string, TParentSearchSchema extends {} = {}, TSearchSchema extends AnySearchSchema = {}, TFullSearchSchema extends AnySearchSchema = {}, TParentParams extends AnyPathParams = {}, TParams extends AnyPathParams = {}, TAllParams extends AnyPathParams = {}, TKnownChildren = unknown> {
    id: TId;
    routeId: TRouteId;
    path: NoInfer<TPath>;
    fullPath: TFullPath;
    options: RouteOptions<TRouteId, TPath, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams>;
    children?: TKnownChildren;
    addChildren: IsAny<TId, any, <TNewChildren extends any>(children: TNewChildren extends AnyRouteConfig[] ? TNewChildren : {
        error: 'Invalid route detected';
        route: TNewChildren;
    }) => RouteConfig<TId, TRouteId, TPath, TFullPath, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams, TNewChildren>>;
    createRoute: CreateRouteConfigFn<false, TId, TFullPath, TFullSearchSchema, TAllParams>;
    generate: GenerateFn<TRouteId, TPath, TParentSearchSchema, TParentParams>;
}
type GenerateFn<TRouteId extends string = string, TPath extends string = string, TParentSearchSchema extends {} = {}, TParentParams extends AnyPathParams = {}> = <TSearchSchema extends AnySearchSchema = {}, TParams extends Record<ParsePathParams<TPath>, unknown> = Record<ParsePathParams<TPath>, string>, TAllParams extends AnyPathParams extends TParams ? Record<ParsePathParams<TPath>, string> : NoInfer<TParams> = AnyPathParams extends TParams ? Record<ParsePathParams<TPath>, string> : NoInfer<TParams>>(options: Omit<RouteOptions<TRouteId, TPath, TParentSearchSchema, TSearchSchema, Expand<TParentSearchSchema & TSearchSchema>, TParentParams, TParams, Expand<TParentParams & TAllParams>>, 'path'>) => void;
type CreateRouteConfigFn<TIsRoot extends boolean = false, TParentId extends string = string, TParentPath extends string = string, TParentRouteLoaderData extends AnyLoaderData = {}, TParentAllLoaderData extends AnyLoaderData = {}, TParentSearchSchema extends AnySearchSchema = {}, TParentParams extends AnyPathParams = {}> = <TRouteId extends string, TPath extends string, TLoaderData extends AnyLoaderData, TSearchSchema extends AnySearchSchema = AnySearchSchema, TParams extends Record<ParsePathParams<TPath>, unknown> = Record<ParsePathParams<TPath>, string>, TAllParams extends AnyPathParams extends TParams ? Record<ParsePathParams<TPath>, string> : NoInfer<TParams> = AnyPathParams extends TParams ? Record<ParsePathParams<TPath>, string> : NoInfer<TParams>, TKnownChildren extends RouteConfig[] = RouteConfig[], TResolvedId extends string = string extends TRouteId ? string extends TPath ? string : TPath : TRouteId>(options?: TIsRoot extends true ? Omit<RouteOptions<TRouteId, TPath, TParentSearchSchema, TSearchSchema, Expand<TParentSearchSchema & TSearchSchema>, TParentParams, TParams, Expand<TParentParams & TAllParams>>, 'path'> & {
    path?: never;
} : RouteOptions<TRouteId, TPath, TParentSearchSchema, TSearchSchema, Expand<TParentSearchSchema & TSearchSchema>, TParentParams, TParams, Expand<TParentParams & TAllParams>>, children?: TKnownChildren, isRoot?: boolean, parentId?: string, parentPath?: string) => RouteConfig<RoutePrefix<TParentId, TResolvedId>, TResolvedId, TPath, string extends TPath ? '' : RoutePath<RoutePrefix<TParentPath, TPath>>, TParentSearchSchema, TSearchSchema, Expand<TParentSearchSchema & TSearchSchema>, TParentParams, TParams, Expand<TParentParams & TAllParams>, TKnownChildren>;
type RoutePath<T extends string> = T extends RootRouteId ? '/' : TrimPathRight<`${T}`>;
type RoutePrefix<TPrefix extends string, TId extends string> = string extends TId ? RootRouteId : TId extends string ? `${TPrefix}/${TId}` extends '/' ? '/' : `/${TrimPathLeft<`${TrimPathRight<TPrefix>}/${TrimPath<TId>}`>}` : never;
interface AnyRouteConfig extends RouteConfig<any, any, any, any, any, any, any, any, any, any, any> {
}
interface AnyRouteConfigWithChildren<TChildren> extends RouteConfig<any, any, any, any, any, any, any, any, any, any, TChildren> {
}
type TrimPath<T extends string> = '' extends T ? '' : TrimPathRight<TrimPathLeft<T>>;
type TrimPathLeft<T extends string> = T extends `${RootRouteId}/${infer U}` ? TrimPathLeft<U> : T extends `/${infer U}` ? TrimPathLeft<U> : T;
type TrimPathRight<T extends string> = T extends '/' ? '/' : T extends `${infer U}/` ? TrimPathRight<U> : T;
declare const createRouteConfig: CreateRouteConfigFn<true>;

interface AnyRoute extends Route<any, any, any> {
}
declare class Route<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TRouteInfo extends AnyRouteInfo = RouteInfo, TRouterContext = unknown> {
    routeInfo: TRouteInfo;
    id: TRouteInfo['id'];
    customId: TRouteInfo['customId'];
    path: TRouteInfo['path'];
    fullPath: TRouteInfo['fullPath'];
    getParentRoute: () => undefined | AnyRoute;
    childRoutes?: AnyRoute[];
    options: RouteOptions;
    originalIndex: number;
    getRouter: () => Router<TAllRouteInfo['routeConfig'], TAllRouteInfo, TRouterContext>;
    constructor(routeConfig: RouteConfig, options: TRouteInfo['options'], originalIndex: number, parent: undefined | Route<TAllRouteInfo, any>, router: Router<TAllRouteInfo['routeConfig'], TAllRouteInfo, TRouterContext>);
}

interface AnyAllRouteInfo {
    routeConfig: AnyRouteConfig;
    routeInfo: AnyRouteInfo;
    routeInfoById: Record<string, AnyRouteInfo>;
    routeInfoByFullPath: Record<string, AnyRouteInfo>;
    routeIds: any;
    routePaths: any;
    fullSearchSchema: Record<string, any>;
    allParams: Record<string, any>;
}
interface DefaultAllRouteInfo {
    routeConfig: RouteConfig;
    routeInfo: RouteInfo;
    routeInfoById: Record<string, RouteInfo>;
    routeInfoByFullPath: Record<string, RouteInfo>;
    routeIds: string;
    routePaths: string;
    fullSearchSchema: AnySearchSchema;
    allParams: AnyPathParams;
}
interface AllRouteInfo<TRouteConfig extends AnyRouteConfig = RouteConfig> extends RoutesInfoInner<TRouteConfig, ParseRouteConfig<TRouteConfig>> {
}
type ParseRouteConfig<TRouteConfig = AnyRouteConfig> = TRouteConfig extends AnyRouteConfig ? RouteConfigRoute<TRouteConfig> | ParseRouteChildren<TRouteConfig> : never;
type ParseRouteChildren<TRouteConfig> = TRouteConfig extends AnyRouteConfigWithChildren<infer TChildren> ? unknown extends TChildren ? never : TChildren extends AnyRouteConfig[] ? Values<{
    [TId in TChildren[number]['id']]: ParseRouteChild<TChildren[number], TId>;
}> : never : never;
type ParseRouteChild<TRouteConfig, TId> = TRouteConfig & {
    id: TId;
} extends AnyRouteConfig ? ParseRouteConfig<TRouteConfig> : never;
type RouteConfigRoute<TRouteConfig> = TRouteConfig extends RouteConfig<infer TId, infer TCustomId, infer TPath, infer TFullPath, infer TParentSearchSchema, infer TSearchSchema, infer TFullSearchSchema, infer TParentParams, infer TParams, infer TAllParams, any> ? string extends TCustomId ? never : RouteInfo<TId, TCustomId, TPath, TFullPath, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams> : never;
interface RoutesInfoInner<TRouteConfig extends AnyRouteConfig, TRouteInfo extends RouteInfo<string, string, any, any, any, any, any, any, any, any> = RouteInfo, TRouteInfoById = {
    '/': TRouteInfo;
} & {
    [TInfo in TRouteInfo as TInfo['id']]: TInfo;
}, TRouteInfoByFullPath = {
    '/': TRouteInfo;
} & {
    [TInfo in TRouteInfo as TInfo['fullPath'] extends RootRouteId ? never : string extends TInfo['fullPath'] ? never : TInfo['fullPath']]: TInfo;
}> {
    routeConfig: TRouteConfig;
    routeInfo: TRouteInfo;
    routeInfoById: TRouteInfoById;
    routeInfoByFullPath: TRouteInfoByFullPath;
    routeIds: keyof TRouteInfoById;
    routePaths: keyof TRouteInfoByFullPath;
    fullSearchSchema: Partial<UnionToIntersection<TRouteInfo['fullSearchSchema']>>;
    allParams: Partial<UnionToIntersection<TRouteInfo['allParams']>>;
}
interface AnyRouteInfo extends RouteInfo<any, any, any, any, any, any, any, any, any, any> {
}
interface RouteInfo<TId extends string = string, TCustomId extends string = string, TPath extends string = string, TFullPath extends string = '/', TParentSearchSchema extends {} = {}, TSearchSchema extends AnySearchSchema = {}, TFullSearchSchema extends AnySearchSchema = {}, TParentParams extends AnyPathParams = {}, TParams extends AnyPathParams = {}, TAllParams extends AnyPathParams = {}> {
    id: TId;
    customId: TCustomId;
    path: TPath;
    fullPath: TFullPath;
    searchSchema: TSearchSchema;
    fullSearchSchema: TFullSearchSchema;
    parentParams: TParentParams;
    params: TParams;
    allParams: TAllParams;
    options: RouteOptions<TCustomId, TPath, TParentSearchSchema, TSearchSchema, TFullSearchSchema, TParentParams, TParams, TAllParams>;
}
type RoutesById<TAllRouteInfo extends AnyAllRouteInfo> = {
    [K in keyof TAllRouteInfo['routeInfoById']]: Route<TAllRouteInfo, TAllRouteInfo['routeInfoById'][K]>;
};
type RouteInfoById<TAllRouteInfo extends AnyAllRouteInfo, TId> = TId extends keyof TAllRouteInfo['routeInfoById'] ? IsAny<TAllRouteInfo['routeInfoById'][TId]['id'], RouteInfo, TAllRouteInfo['routeInfoById'][TId]> : never;
type RouteInfoByPath<TAllRouteInfo extends AnyAllRouteInfo, TPath> = TPath extends keyof TAllRouteInfo['routeInfoByFullPath'] ? IsAny<TAllRouteInfo['routeInfoByFullPath'][TPath]['id'], RouteInfo, TAllRouteInfo['routeInfoByFullPath'][TPath]> : never;

type LinkInfo = {
    type: 'external';
    href: string;
} | {
    type: 'internal';
    next: ParsedLocation;
    handleFocus: (e: any) => void;
    handleClick: (e: any) => void;
    handleEnter: (e: any) => void;
    handleLeave: (e: any) => void;
    isActive: boolean;
    disabled?: boolean;
};
type CleanPath<T extends string> = T extends `${infer L}//${infer R}` ? CleanPath<`${CleanPath<L>}/${CleanPath<R>}`> : T extends `${infer L}//` ? `${CleanPath<L>}/` : T extends `//${infer L}` ? `/${CleanPath<L>}` : T;
type Split<S, TIncludeTrailingSlash = true> = S extends unknown ? string extends S ? string[] : S extends string ? CleanPath<S> extends '' ? [] : TIncludeTrailingSlash extends true ? CleanPath<S> extends `${infer T}/` ? [...Split<T>, '/'] : CleanPath<S> extends `/${infer U}` ? Split<U> : CleanPath<S> extends `${infer T}/${infer U}` ? [...Split<T>, ...Split<U>] : [S] : CleanPath<S> extends `${infer T}/${infer U}` ? [...Split<T>, ...Split<U>] : S extends string ? [S] : never : never : never;
type ParsePathParams<T extends string> = Split<T>[number] extends infer U ? U extends `$${infer V}` ? V : never : never;
type Join<T> = T extends [] ? '' : T extends [infer L extends string] ? L : T extends [infer L extends string, ...infer Tail extends [...string[]]] ? CleanPath<`${L}/${Join<Tail>}`> : never;
type RelativeToPathAutoComplete<AllPaths extends string, TFrom extends string, TTo extends string, SplitPaths extends string[] = Split<AllPaths, false>> = TTo extends `..${infer _}` ? SplitPaths extends [
    ...Split<ResolveRelativePath<TFrom, TTo>, false>,
    ...infer TToRest
] ? `${CleanPath<Join<[
    ...Split<TTo, false>,
    ...(TToRest | (Split<ResolveRelativePath<TFrom, TTo>, false>['length'] extends 1 ? never : ['../']))
]>>}` : never : TTo extends `./${infer RestTTo}` ? SplitPaths extends [
    ...Split<TFrom, false>,
    ...Split<RestTTo, false>,
    ...infer RestPath
] ? `${TTo}${Join<RestPath>}` : never : (TFrom extends `/` ? never : SplitPaths extends [...Split<TFrom, false>, ...infer RestPath] ? Join<RestPath> extends {
    length: 0;
} ? never : './' : never) | (TFrom extends `/` ? never : '../') | AllPaths;
type NavigateOptions<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TFrom extends TAllRouteInfo['routePaths'] = '/', TTo extends string = '.'> = ToOptions<TAllRouteInfo, TFrom, TTo> & {
    replace?: boolean;
};
type ToOptions<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TFrom extends TAllRouteInfo['routePaths'] = '/', TTo extends string = '.', TResolvedTo = ResolveRelativePath<TFrom, NoInfer<TTo>>> = {
    to?: ToPathOption<TAllRouteInfo, TFrom, TTo>;
    hash?: Updater<string>;
    state?: LocationState;
    from?: TFrom;
} & CheckPath<TAllRouteInfo, NoInfer<TResolvedTo>, {}> & SearchParamOptions<TAllRouteInfo, TFrom, TResolvedTo> & PathParamOptions<TAllRouteInfo, TFrom, TResolvedTo>;
type SearchParamOptions<TAllRouteInfo extends AnyAllRouteInfo, TFrom, TTo, TFromSchema = Expand<UnionToIntersection<TAllRouteInfo['fullSearchSchema'] & RouteInfoByPath<TAllRouteInfo, TFrom> extends never ? {} : RouteInfoByPath<TAllRouteInfo, TFrom>['fullSearchSchema']>>, TToSchema = Partial<RouteInfoByPath<TAllRouteInfo, TFrom>['fullSearchSchema']> & Omit<RouteInfoByPath<TAllRouteInfo, TTo>['fullSearchSchema'], keyof PickRequired<RouteInfoByPath<TAllRouteInfo, TFrom>['fullSearchSchema']>>, TFromFullSchema = Expand<UnionToIntersection<TAllRouteInfo['fullSearchSchema'] & TFromSchema>>, TToFullSchema = Expand<UnionToIntersection<TAllRouteInfo['fullSearchSchema'] & TToSchema>>> = keyof PickRequired<TToSchema> extends never ? {
    search?: true | SearchReducer<TFromFullSchema, TToFullSchema>;
} : {
    search: SearchReducer<TFromFullSchema, TToFullSchema>;
};
type SearchReducer<TFrom, TTo> = {
    [TKey in keyof TTo]: TTo[TKey];
} | ((current: TFrom) => TTo);
type PathParamOptions<TAllRouteInfo extends AnyAllRouteInfo, TFrom, TTo, TFromSchema = Expand<UnionToIntersection<RouteInfoByPath<TAllRouteInfo, TFrom> extends never ? {} : RouteInfoByPath<TAllRouteInfo, TFrom>['allParams']>>, TToSchema = Partial<RouteInfoByPath<TAllRouteInfo, TFrom>['allParams']> & Omit<RouteInfoByPath<TAllRouteInfo, TTo>['allParams'], keyof PickRequired<RouteInfoByPath<TAllRouteInfo, TFrom>['allParams']>>, TFromFullParams = Expand<UnionToIntersection<TAllRouteInfo['allParams'] & TFromSchema>>, TToFullParams = Expand<UnionToIntersection<TAllRouteInfo['allParams'] & TToSchema>>> = keyof PickRequired<TToSchema> extends never ? {
    params?: ParamsReducer<TFromFullParams, TToFullParams>;
} : {
    params: ParamsReducer<TFromFullParams, TToFullParams>;
};
type ParamsReducer<TFrom, TTo> = TTo | ((current: TFrom) => TTo);
type ToPathOption<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TFrom extends TAllRouteInfo['routePaths'] = '/', TTo extends string = '.'> = TTo | RelativeToPathAutoComplete<TAllRouteInfo['routePaths'], NoInfer<TFrom> extends string ? NoInfer<TFrom> : '', NoInfer<TTo> & string>;
type ToIdOption<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TFrom extends TAllRouteInfo['routePaths'] = '/', TTo extends string = '.'> = TTo | RelativeToPathAutoComplete<TAllRouteInfo['routeIds'], NoInfer<TFrom> extends string ? NoInfer<TFrom> : '', NoInfer<TTo> & string>;
interface ActiveOptions {
    exact?: boolean;
    includeHash?: boolean;
}
type LinkOptions<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo, TFrom extends TAllRouteInfo['routePaths'] = '/', TTo extends string = '.'> = NavigateOptions<TAllRouteInfo, TFrom, TTo> & {
    target?: HTMLAnchorElement['target'];
    activeOptions?: ActiveOptions;
    preload?: false | 'intent';
    preloadMaxAge?: number;
    preloadGcMaxAge?: number;
    preloadDelay?: number;
    disabled?: boolean;
};
type CheckRelativePath<TAllRouteInfo extends AnyAllRouteInfo, TFrom, TTo> = TTo extends string ? TFrom extends string ? ResolveRelativePath<TFrom, TTo> extends TAllRouteInfo['routePaths'] ? {} : {
    Error: `${TFrom} + ${TTo} resolves to ${ResolveRelativePath<TFrom, TTo>}, which is not a valid route path.`;
    'Valid Route Paths': TAllRouteInfo['routePaths'];
} : {} : {};
type CheckPath<TAllRouteInfo extends AnyAllRouteInfo, TPath, TPass> = Exclude<TPath, TAllRouteInfo['routePaths']> extends never ? TPass : CheckPathError<TAllRouteInfo, Exclude<TPath, TAllRouteInfo['routePaths']>>;
type CheckPathError<TAllRouteInfo extends AnyAllRouteInfo, TInvalids> = Expand<{
    Error: `${TInvalids extends string ? TInvalids : never} is not a valid route path.`;
    'Valid Route Paths': TAllRouteInfo['routePaths'];
}>;
type CheckId<TAllRouteInfo extends AnyAllRouteInfo, TPath, TPass> = Exclude<TPath, TAllRouteInfo['routeIds']> extends never ? TPass : CheckIdError<TAllRouteInfo, Exclude<TPath, TAllRouteInfo['routeIds']>>;
type CheckIdError<TAllRouteInfo extends AnyAllRouteInfo, TInvalids> = Expand<{
    Error: `${TInvalids extends string ? TInvalids : never} is not a valid route ID.`;
    'Valid Route IDs': TAllRouteInfo['routeIds'];
}>;
type ResolveRelativePath<TFrom, TTo = '.'> = TFrom extends string ? TTo extends string ? TTo extends '.' ? TFrom : TTo extends `./` ? Join<[TFrom, '/']> : TTo extends `./${infer TRest}` ? ResolveRelativePath<TFrom, TRest> : TTo extends `/${infer TRest}` ? TTo : Split<TTo> extends ['..', ...infer ToRest] ? Split<TFrom> extends [...infer FromRest, infer FromTail] ? ToRest extends ['/'] ? Join<[...FromRest, '/']> : ResolveRelativePath<Join<FromRest>, Join<ToRest>> : never : Split<TTo> extends ['.', ...infer ToRest] ? ToRest extends ['/'] ? Join<[TFrom, '/']> : ResolveRelativePath<TFrom, Join<ToRest>> : CleanPath<Join<['/', ...Split<TFrom>, ...Split<TTo>]>> : never : never;
type ValidFromPath<TAllRouteInfo extends AnyAllRouteInfo = DefaultAllRouteInfo> = undefined | (string extends TAllRouteInfo['routePaths'] ? string : TAllRouteInfo['routePaths']);

interface Segment {
    type: 'pathname' | 'param' | 'wildcard';
    value: string;
}
declare function joinPaths(paths: (string | undefined)[]): string;
declare function cleanPath(path: string): string;
declare function trimPathLeft(path: string): string;
declare function trimPathRight(path: string): string;
declare function trimPath(path: string): string;
declare function resolvePath(basepath: string, base: string, to: string): string;
declare function parsePathname(pathname?: string): Segment[];
declare function interpolatePath(path: string | undefined, params: any, leaveWildcard?: boolean): string;
declare function matchPathname(basepath: string, currentPathname: string, matchLocation: Pick<MatchLocation, 'to' | 'fuzzy' | 'caseSensitive'>): AnyPathParams | undefined;
declare function matchByPath(basepath: string, from: string, matchLocation: Pick<MatchLocation, 'to' | 'caseSensitive' | 'fuzzy'>): Record<string, string> | undefined;

declare function encode(obj: any, pfx?: string): string;
declare function decode(str: any): {};

declare const defaultParseSearch: (searchStr: string) => AnySearchSchema;
declare const defaultStringifySearch: (search: Record<string, any>) => string;
declare function parseSearchWith(parser: (str: string) => any): (searchStr: string) => AnySearchSchema;
declare function stringifySearchWith(stringify: (search: any) => string): (search: Record<string, any>) => string;

export { ActiveOptions, AllRouteInfo, AnyAllRouteInfo, AnyLoaderData, AnyPathParams, AnyRoute, AnyRouteConfig, AnyRouteConfigWithChildren, AnyRouteInfo, AnyRouter, AnySearchSchema, BuildNextOptions, CheckId, CheckIdError, CheckPath, CheckPathError, CheckRelativePath, DeepAwaited, DefaultAllRouteInfo, DefinedPathParamWarning, DehydratedRouter, DehydratedRouterState, Expand, FilterRoutesFn, FrameworkGenerics, FromLocation, GetFrameworkGeneric, IsAny, IsAnyBoolean, IsKnown, LinkInfo, LinkOptions, ListenerFn, LoaderContext, LoaderState, LocationState, MatchCache, MatchCacheEntry, MatchLocation, MatchRouteOptions, NavigateOptions, NoInfer, OnLoadFn, ParentParams, ParsePathParams, ParseRouteConfig, ParsedLocation, ParsedPath, PathParamMask, PathParamOptions, PickAsPartial, PickAsRequired, PickExclude, PickExtra, PickExtract, PickRequired, PickUnsafe, RegisterRouter, RegisteredAllRouteInfo, RegisteredRouter, RelativeToPathAutoComplete, ResolveRelativePath, RootRouteId, Route, RouteConfig, RouteConfigRoute, RouteInfo, RouteInfoById, RouteInfoByPath, RouteMatch, RouteMatchStore, RouteMeta, RouteOptions, Router, RouterContext, RouterHistory, RouterLocation, RouterOptions, RouterStore, RoutesById, RoutesInfoInner, SearchFilter, SearchParamOptions, SearchParser, SearchSchemaValidator, SearchSchemaValidatorFn, SearchSchemaValidatorObj, SearchSerializer, Segment, Split, Timeout, ToIdOption, ToOptions, ToPathOption, UnionToIntersection, UnloaderFn, Updater, ValidFromPath, ValueKeys, Values, cleanPath, createBrowserHistory, createHashHistory, createMemoryHistory, createRouteConfig, decode, defaultFetchServerDataFn, defaultParseSearch, defaultStringifySearch, encode, functionalUpdate, interpolatePath, isPlainObject, joinPaths, last, matchByPath, matchPathname, parsePathname, parseSearchWith, pick, replaceEqualDeep, resolvePath, rootRouteId, stringifySearchWith, trimPath, trimPathLeft, trimPathRight, warning };
