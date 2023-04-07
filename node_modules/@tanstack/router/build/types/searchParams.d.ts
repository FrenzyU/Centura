import { AnySearchSchema } from './routeConfig';
export declare const defaultParseSearch: (searchStr: string) => AnySearchSchema;
export declare const defaultStringifySearch: (search: Record<string, any>) => string;
export declare function parseSearchWith(parser: (str: string) => any): (searchStr: string) => AnySearchSchema;
export declare function stringifySearchWith(stringify: (search: any) => string): (search: Record<string, any>) => string;
