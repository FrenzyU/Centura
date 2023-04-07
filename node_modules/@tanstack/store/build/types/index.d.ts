/**
 * store
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
declare class Store<TState> {
    #private;
    listeners: Set<(next: TState, prev: TState) => void>;
    state: TState;
    batching: boolean;
    queue: ((...args: any[]) => void)[];
    constructor(initialState: TState);
    subscribe: (listener: (next: TState, prev: TState) => void) => () => void;
    setState: (updater: (cb: TState) => void) => void;
    batch: (cb: () => void) => void;
}

export { Store };
