import { GetFrameworkGeneric } from './frameworks';
import { ParsePathParams } from './link';
import { RouteInfo } from './routeInfo';
import { RouteMatch } from './routeMatch';
import { AnyRouter } from './router';
import { Expand, IsAny, NoInfer, PickUnsafe } from './utils';
export declare const rootRouteId: "__root__";
export type RootRouteId = typeof rootRouteId;
export type AnyLoaderData = {};
export type AnyPathParams = {};
export type AnySearchSchema = {};
export interface RouteMeta {
}
export type SearchSchemaValidator<TReturn, TParentSchema> = SearchSchemaValidatorObj<TReturn, TParentSchema> | SearchSchemaValidatorFn<TReturn, TParentSchema>;
export type SearchSchemaValidatorObj<TReturn, TParentSchema> = {
    parse?: SearchSchemaValidatorFn<TReturn, TParentSchema>;
};
export type SearchSchemaValidatorFn<TReturn, TParentSchema> = (searchObj: Record<string, unknown>) => {} extends TParentSchema ? TReturn : keyof TReturn extends keyof TParentSchema ? {
    error: 'Top level search params cannot be redefined by child routes!';
    keys: keyof TReturn & keyof TParentSchema;
} : TReturn;
export type DefinedPathParamWarning = 'Path params cannot be redefined by child routes!';
export type ParentParams<TParentParams> = AnyPathParams extends TParentParams ? {} : {
    [Key in keyof TParentParams]?: DefinedPathParamWarning;
};
export type OnLoadFn<TFullSearchSchema extends AnySearchSchema = {}, TAllParams extends AnyPathParams = {}> = (loaderContext: LoaderContext<TFullSearchSchema, TAllParams>) => Promise<any> | void;
export interface LoaderContext<TFullSearchSchema extends AnySearchSchema = {}, TAllParams extends AnyPathParams = {}> {
    params: TAllParams;
    search: TFullSearchSchema;
    signal?: AbortSignal;
}
export type UnloaderFn<TPath extends string> = (routeMatch: RouteMatch<any, RouteInfo<string, TPath>>) => void;
export type RouteOptions<TRouteId extends string = string, TPath extends string = string, TParentSearchSchema extends {} = {}, TSearchSchema extends AnySearchSchema = {}, TFullSearchSchema extends AnySearchSchema = TSearchSchema, TParentParams extends AnyPathParams = {}, TParams extends Record<ParsePathParams<TPath>, unknown> = Record<ParsePathParams<TPath>, string>, TAllParams extends AnyPathParams = {}> = ({
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
export type SearchFilter<T, U = T> = (prev: T) => U;
export interface RouteConfig<TId extends string = string, TRouteId extends string = string, TPath extends string = string, TFullPath extends string = string, TParentSearchSchema extends {} = {}, TSearchSchema extends AnySearchSchema = {}, TFullSearchSchema extends AnySearchSchema = {}, TParentParams extends AnyPathParams = {}, TParams extends AnyPathParams = {}, TAllParams extends AnyPathParams = {}, TKnownChildren = unknown> {
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
export interface AnyRouteConfig extends RouteConfig<any, any, any, any, any, any, any, any, any, any, any> {
}
export interface AnyRouteConfigWithChildren<TChildren> extends RouteConfig<any, any, any, any, any, any, any, any, any, any, TChildren> {
}
type TrimPath<T extends string> = '' extends T ? '' : TrimPathRight<TrimPathLeft<T>>;
type TrimPathLeft<T extends string> = T extends `${RootRouteId}/${infer U}` ? TrimPathLeft<U> : T extends `/${infer U}` ? TrimPathLeft<U> : T;
type TrimPathRight<T extends string> = T extends '/' ? '/' : T extends `${infer U}/` ? TrimPathRight<U> : T;
export declare const createRouteConfig: CreateRouteConfigFn<true>;
export {};
