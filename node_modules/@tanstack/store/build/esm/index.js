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
import { setAutoFreeze, produce } from 'immer';

setAutoFreeze(false);

// interface StoreOptions {
//   onSubscribe?: () => (() => void) | void
// }

class Store {
  listeners = new Set();
  // options?: StoreOptions
  batching = false;
  queue = [];
  constructor(initialState
  // options?: StoreOptions
  ) {
    this.state = initialState;
    // this.options = options
  }

  subscribe = listener => {
    this.listeners.add(listener);
    // const unsub = this.options?.onSubscribe?.()
    return () => {
      this.listeners.delete(listener);
      // unsub?.()
    };
  };

  setState = updater => {
    const previous = this.state;
    this.state = produce(d => {
      updater(d);
    })(previous);
    this.queue.push(() => this.listeners.forEach(listener => listener(this.state, previous)));
    this.#flush();
  };
  #flush = () => {
    if (this.batching) return;
    this.queue.forEach(cb => cb());
    this.queue = [];
  };
  batch = cb => {
    this.batching = true;
    cb();
    this.batching = false;
    this.#flush();
  };
}

export { Store };
//# sourceMappingURL=index.js.map
