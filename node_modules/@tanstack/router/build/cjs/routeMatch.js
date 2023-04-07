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
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var store = require('@tanstack/store');

//

const componentTypes = ['component', 'errorComponent', 'pendingComponent'];
class RouteMatch {
  abortController = new AbortController();
  onLoaderDataListeners = new Set();
  constructor(router, route, opts) {
    Object.assign(this, {
      route,
      router,
      id: opts.id,
      pathname: opts.pathname,
      params: opts.params,
      store: new store.Store({
        updatedAt: 0,
        routeSearch: {},
        search: {},
        status: 'idle'
      })
    });
    if (!this.#hasLoaders()) {
      this.store.setState(s => ({
        ...s,
        status: 'success'
      }));
    }
  }
  cancel = () => {
    this.abortController?.abort();
  };
  load = async () => {
    // If the match is invalid, errored or idle, trigger it to load
    if (this.store.state.status !== 'pending') {
      await this.fetch();
    }
  };
  #latestId = '';
  fetch = async () => {
    this.__loadPromise = Promise.resolve().then(async () => {
      const loadId = '' + Date.now() + Math.random();
      this.#latestId = loadId;
      const checkLatest = () => {
        return loadId !== this.#latestId ? this.__loadPromise : undefined;
      };
      let latestPromise;
      this.store.batch(() => {
        // If the match was in an error state, set it
        // to a loading state again. Otherwise, keep it
        // as loading or resolved
        if (this.store.state.status === 'idle') {
          this.store.setState(s => ({
            ...s,
            status: 'pending'
          }));
        }
      });
      const componentsPromise = (async () => {
        // then run all component and data loaders in parallel
        // For each component type, potentially load it asynchronously

        await Promise.all(componentTypes.map(async type => {
          const component = this.route.options[type];
          if (this[type]?.preload) {
            this[type] = await this.router.options.loadComponent(component);
          }
        }));
      })();
      const dataPromise = Promise.resolve().then(() => {
        if (this.route.options.onLoad) {
          return this.route.options.onLoad({
            params: this.params,
            search: this.store.state.search,
            signal: this.abortController.signal
          });
        }
        return;
      });
      try {
        await componentsPromise;
        await dataPromise;
        if (latestPromise = checkLatest()) return await latestPromise;
        this.store.setState(s => ({
          ...s,
          error: undefined,
          status: 'success',
          updatedAt: Date.now()
        }));
      } catch (err) {
        this.store.setState(s => ({
          ...s,
          error: err,
          status: 'error',
          updatedAt: Date.now()
        }));
      } finally {
        delete this.__loadPromise;
      }
    });
    return this.__loadPromise;
  };
  #hasLoaders = () => {
    return !!(this.route.options.onLoad || componentTypes.some(d => this.route.options[d]?.preload));
  };
  __setParentMatch = parentMatch => {
    if (!this.parentMatch && parentMatch) {
      this.parentMatch = parentMatch;
    }
  };
  __validate = () => {
    // Validate the search params and stabilize them
    const parentSearch = this.parentMatch?.store.state.search ?? this.router.store.state.latestLocation.search;
    try {
      const validator = typeof this.route.options.validateSearch === 'object' ? this.route.options.validateSearch.parse : this.route.options.validateSearch;
      let nextSearch = validator?.(parentSearch) ?? {};
      this.store.setState(s => ({
        ...s,
        routeSearch: nextSearch,
        search: {
          ...parentSearch,
          ...nextSearch
        }
      }));
      componentTypes.map(async type => {
        const component = this.route.options[type];
        if (typeof this[type] !== 'function') {
          this[type] = component;
        }
      });
    } catch (err) {
      console.error(err);
      const error = new Error('Invalid search params found', {
        cause: err
      });
      error.code = 'INVALID_SEARCH_PARAMS';
      this.store.setState(s => ({
        ...s,
        status: 'error',
        error: error
      }));

      // Do not proceed with loading the route
      return;
    }
  };
}

exports.RouteMatch = RouteMatch;
//# sourceMappingURL=routeMatch.js.map
