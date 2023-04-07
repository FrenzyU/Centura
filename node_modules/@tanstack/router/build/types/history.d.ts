export interface RouterHistory {
    location: RouterLocation;
    listen: (cb: () => void) => () => void;
    push: (path: string, state: any) => void;
    replace: (path: string, state: any) => void;
    go: (index: number) => void;
    back: () => void;
    forward: () => void;
}
export interface ParsedPath {
    href: string;
    pathname: string;
    search: string;
    hash: string;
}
export interface RouterLocation extends ParsedPath {
    state: any;
}
export declare function createBrowserHistory(opts?: {
    getHref?: () => string;
    createHref?: (path: string) => string;
}): RouterHistory;
export declare function createHashHistory(): RouterHistory;
export declare function createMemoryHistory(opts?: {
    initialEntries: string[];
    initialIndex?: number;
}): RouterHistory;
