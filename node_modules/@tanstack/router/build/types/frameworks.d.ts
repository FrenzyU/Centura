export interface FrameworkGenerics {
}
export type GetFrameworkGeneric<U> = U extends keyof FrameworkGenerics ? FrameworkGenerics[U] : any;
