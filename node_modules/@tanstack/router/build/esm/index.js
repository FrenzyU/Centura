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
import invariant from 'tiny-invariant';
export { default as invariant } from 'tiny-invariant';
import { Store } from '@tanstack/store';

// While the public API was clearly inspired by the "history" npm package,
// This implementation attempts to be more lightweight by
// making assumptions about the way TanStack Router works

const popStateEvent = 'popstate';
function createHistory(opts) {
  let currentLocation = opts.getLocation();
  let unsub = () => {};
  let listeners = new Set();
  const onUpdate = () => {
    currentLocation = opts.getLocation();
    listeners.forEach(listener => listener());
  };
  return {
    get location() {
      return currentLocation;
    },
    listen: cb => {
      if (listeners.size === 0) {
        unsub = opts.listener(onUpdate);
      }
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
        if (listeners.size === 0) {
          unsub();
        }
      };
    },
    push: (path, state) => {
      opts.pushState(path, state);
      onUpdate();
    },
    replace: (path, state) => {
      opts.replaceState(path, state);
      onUpdate();
    },
    go: index => {
      opts.go(index);
      onUpdate();
    },
    back: () => {
      opts.back();
      onUpdate();
    },
    forward: () => {
      opts.forward();
      onUpdate();
    }
  };
}
function createBrowserHistory(opts) {
  const getHref = opts?.getHref ?? (() => `${window.location.pathname}${window.location.hash}${window.location.search}`);
  const createHref = opts?.createHref ?? (path => path);
  const getLocation = () => parseLocation(getHref(), history.state);
  return createHistory({
    getLocation,
    listener: onUpdate => {
      window.addEventListener(popStateEvent, onUpdate);
      return () => {
        window.removeEventListener(popStateEvent, onUpdate);
      };
    },
    pushState: (path, state) => {
      window.history.pushState({
        ...state,
        key: createRandomKey()
      }, '', createHref(path));
    },
    replaceState: (path, state) => {
      window.history.replaceState({
        ...state,
        key: createRandomKey()
      }, '', createHref(path));
    },
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    go: n => window.history.go(n)
  });
}
function createHashHistory() {
  return createBrowserHistory({
    getHref: () => window.location.hash.substring(1),
    createHref: path => `#${path}`
  });
}
function createMemoryHistory(opts = {
  initialEntries: ['/']
}) {
  const entries = opts.initialEntries;
  let index = opts.initialIndex ?? entries.length - 1;
  let currentState = {};
  const getLocation = () => parseLocation(entries[index], currentState);
  return createHistory({
    getLocation,
    listener: () => {
      return () => {};
    },
    pushState: (path, state) => {
      currentState = {
        ...state,
        key: createRandomKey()
      };
      entries.push(path);
      index++;
    },
    replaceState: (path, state) => {
      currentState = {
        ...state,
        key: createRandomKey()
      };
      entries[index] = path;
    },
    back: () => {
      index--;
    },
    forward: () => {
      index = Math.min(index + 1, entries.length - 1);
    },
    go: n => window.history.go(n)
  });
}
function parseLocation(href, state) {
  let hashIndex = href.indexOf('#');
  let searchIndex = href.indexOf('?');
  return {
    href,
    pathname: href.substring(0, hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length),
    hash: hashIndex > -1 ? href.substring(hashIndex, searchIndex) : '',
    search: searchIndex > -1 ? href.substring(searchIndex) : '',
    state
  };
}

// Thanks co-pilot!
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}

function last(arr) {
  return arr[arr.length - 1];
}
function warning(cond, message) {
  if (cond) {
    if (typeof console !== 'undefined') console.warn(message);
    try {
      throw new Error(message);
    } catch {}
  }
  return true;
}
function isFunction(d) {
  return typeof d === 'function';
}
function functionalUpdate(updater, previous) {
  if (isFunction(updater)) {
    return updater(previous);
  }
  return updater;
}
function pick(parent, keys) {
  return keys.reduce((obj, key) => {
    obj[key] = parent[key];
    return obj;
  }, {});
}

/**
 * This function returns `a` if `b` is deeply equal.
 * If not, it will replace any deeply equal children of `b` with those of `a`.
 * This can be used for structural sharing between immutable JSON values for example.
 * Do not use this with signals
 */
function replaceEqualDeep(prev, _next) {
  if (prev === _next) {
    return prev;
  }
  const next = _next;
  const array = Array.isArray(prev) && Array.isArray(next);
  if (array || isPlainObject(prev) && isPlainObject(next)) {
    const prevSize = array ? prev.length : Object.keys(prev).length;
    const nextItems = array ? next : Object.keys(next);
    const nextSize = nextItems.length;
    const copy = array ? [] : {};
    let equalItems = 0;
    for (let i = 0; i < nextSize; i++) {
      const key = array ? i : nextItems[i];
      copy[key] = replaceEqualDeep(prev[key], next[key]);
      if (copy[key] === prev[key]) {
        equalItems++;
      }
    }
    return prevSize === nextSize && equalItems === prevSize ? prev : copy;
  }
  return next;
}

// Copied from: https://github.com/jonschlinkert/is-plain-object
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === 'undefined') {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Most likely a plain Object
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function joinPaths(paths) {
  return cleanPath(paths.filter(Boolean).join('/'));
}
function cleanPath(path) {
  // remove double slashes
  return path.replace(/\/{2,}/g, '/');
}
function trimPathLeft(path) {
  return path === '/' ? path : path.replace(/^\/{1,}/, '');
}
function trimPathRight(path) {
  return path === '/' ? path : path.replace(/\/{1,}$/, '');
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
function resolvePath(basepath, base, to) {
  base = base.replace(new RegExp(`^${basepath}`), '/');
  to = to.replace(new RegExp(`^${basepath}`), '/');
  let baseSegments = parsePathname(base);
  const toSegments = parsePathname(to);
  toSegments.forEach((toSegment, index) => {
    if (toSegment.value === '/') {
      if (!index) {
        // Leading slash
        baseSegments = [toSegment];
      } else if (index === toSegments.length - 1) {
        // Trailing Slash
        baseSegments.push(toSegment);
      } else ;
    } else if (toSegment.value === '..') {
      // Extra trailing slash? pop it off
      if (baseSegments.length > 1 && last(baseSegments)?.value === '/') {
        baseSegments.pop();
      }
      baseSegments.pop();
    } else if (toSegment.value === '.') {
      return;
    } else {
      baseSegments.push(toSegment);
    }
  });
  const joined = joinPaths([basepath, ...baseSegments.map(d => d.value)]);
  return cleanPath(joined);
}
function parsePathname(pathname) {
  if (!pathname) {
    return [];
  }
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === '/') {
    pathname = pathname.substring(1);
    segments.push({
      type: 'pathname',
      value: '/'
    });
  }
  if (!pathname) {
    return segments;
  }

  // Remove empty segments and '.' segments
  const split = pathname.split('/').filter(Boolean);
  segments.push(...split.map(part => {
    if (part.startsWith('*')) {
      return {
        type: 'wildcard',
        value: part
      };
    }
    if (part.charAt(0) === '$') {
      return {
        type: 'param',
        value: part
      };
    }
    return {
      type: 'pathname',
      value: part
    };
  }));
  if (pathname.slice(-1) === '/') {
    pathname = pathname.substring(1);
    segments.push({
      type: 'pathname',
      value: '/'
    });
  }
  return segments;
}
function interpolatePath(path, params, leaveWildcard) {
  const interpolatedPathSegments = parsePathname(path);
  return joinPaths(interpolatedPathSegments.map(segment => {
    if (segment.value === '*' && !leaveWildcard) {
      return '';
    }
    if (segment.type === 'param') {
      return params[segment.value.substring(1)] ?? '';
    }
    return segment.value;
  }));
}
function matchPathname(basepath, currentPathname, matchLocation) {
  const pathParams = matchByPath(basepath, currentPathname, matchLocation);
  // const searchMatched = matchBySearch(currentLocation.search, matchLocation)

  if (matchLocation.to && !pathParams) {
    return;
  }
  return pathParams ?? {};
}
function matchByPath(basepath, from, matchLocation) {
  if (!from.startsWith(basepath)) {
    return undefined;
  }
  from = basepath != '/' ? from.substring(basepath.length) : from;
  const baseSegments = parsePathname(from);
  const to = `${matchLocation.to ?? '*'}`;
  const routeSegments = parsePathname(to);
  const params = {};
  let isMatch = (() => {
    for (let i = 0; i < Math.max(baseSegments.length, routeSegments.length); i++) {
      const baseSegment = baseSegments[i];
      const routeSegment = routeSegments[i];
      const isLastRouteSegment = i === routeSegments.length - 1;
      const isLastBaseSegment = i === baseSegments.length - 1;
      if (routeSegment) {
        if (routeSegment.type === 'wildcard') {
          if (baseSegment?.value) {
            params['*'] = joinPaths(baseSegments.slice(i).map(d => d.value));
            return true;
          }
          return false;
        }
        if (routeSegment.type === 'pathname') {
          if (routeSegment.value === '/' && !baseSegment?.value) {
            return true;
          }
          if (baseSegment) {
            if (matchLocation.caseSensitive) {
              if (routeSegment.value !== baseSegment.value) {
                return false;
              }
            } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
              return false;
            }
          }
        }
        if (!baseSegment) {
          return false;
        }
        if (routeSegment.type === 'param') {
          if (baseSegment?.value === '/') {
            return false;
          }
          if (baseSegment.value.charAt(0) !== '$') {
            params[routeSegment.value.substring(1)] = baseSegment.value;
          }
        }
      }
      if (isLastRouteSegment && !isLastBaseSegment) {
        return !!matchLocation.fuzzy;
      }
    }
    return true;
  })();
  return isMatch ? params : undefined;
}

// @ts-nocheck

// qss has been slightly modified and inlined here for our use cases (and compression's sake). We've included it as a hard dependency for MIT license attribution.

function encode(obj, pfx) {
  var k,
    i,
    tmp,
    str = '';
  for (k in obj) {
    if ((tmp = obj[k]) !== void 0) {
      if (Array.isArray(tmp)) {
        for (i = 0; i < tmp.length; i++) {
          str && (str += '&');
          str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp[i]);
        }
      } else {
        str && (str += '&');
        str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp);
      }
    }
  }
  return (pfx || '') + str;
}
function toValue(mix) {
  if (!mix) return '';
  var str = decodeURIComponent(mix);
  if (str === 'false') return false;
  if (str === 'true') return true;
  if (str.charAt(0) === '0') return str;
  return +str * 0 === 0 ? +str : str;
}
function decode(str) {
  var tmp,
    k,
    out = {},
    arr = str.split('&');
  while (tmp = arr.shift()) {
    tmp = tmp.split('=');
    k = tmp.shift();
    if (out[k] !== void 0) {
      out[k] = [].concat(out[k], toValue(tmp.shift()));
    } else {
      out[k] = toValue(tmp.shift());
    }
  }
  return out;
}

class Route {
  constructor(routeConfig, options, originalIndex, parent, router) {
    Object.assign(this, {
      ...routeConfig,
      originalIndex,
      options,
      getRouter: () => router,
      childRoutes: undefined,
      getParentRoute: () => parent
    });
    router.options.createRoute?.({
      router,
      route: this
    });
  }
}

const rootRouteId = '__root__';
const createRouteConfig = (options = {}, children = [], isRoot = true, parentId, parentPath) => {
  if (isRoot) {
    options.path = rootRouteId;
  }

  // Strip the root from parentIds
  if (parentId === rootRouteId) {
    parentId = '';
  }
  let path = isRoot ? rootRouteId : options.path;

  // If the path is anything other than an index path, trim it up
  if (path && path !== '/') {
    path = trimPath(path);
  }
  const routeId = path || options.id;
  let id = joinPaths([parentId, routeId]);
  if (path === rootRouteId) {
    path = '/';
  }
  if (id !== rootRouteId) {
    id = joinPaths(['/', id]);
  }
  const fullPath = id === rootRouteId ? '/' : trimPathRight(joinPaths([parentPath, path]));
  return {
    id: id,
    routeId: routeId,
    path: path,
    fullPath: fullPath,
    options: options,
    children,
    addChildren: children => createRouteConfig(options, children, false, parentId, parentPath),
    createRoute: childOptions => createRouteConfig(childOptions, undefined, false, id, fullPath),
    generate: () => {
      invariant(false, `routeConfig.generate() is used by TanStack Router's file-based routing code generation and should not actually be called during runtime. `);
    }
  };
};

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
      store: new Store({
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

const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(JSON.stringify);
function parseSearchWith(parser) {
  return searchStr => {
    if (searchStr.substring(0, 1) === '?') {
      searchStr = searchStr.substring(1);
    }
    let query = decode(searchStr);

    // Try to parse any query params that might be json
    for (let key in query) {
      const value = query[key];
      if (typeof value === 'string') {
        try {
          query[key] = parser(value);
        } catch (err) {
          //
        }
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify) {
  return search => {
    search = {
      ...search
    };
    if (search) {
      Object.keys(search).forEach(key => {
        const val = search[key];
        if (typeof val === 'undefined' || val === undefined) {
          delete search[key];
        } else if (val && typeof val === 'object' && val !== null) {
          try {
            search[key] = stringify(val);
          } catch (err) {
            // silent
          }
        }
      });
    }
    const searchStr = encode(search).toString();
    return searchStr ? `?${searchStr}` : '';
  };
}

const defaultFetchServerDataFn = async ({
  router,
  routeMatch
}) => {
  const next = router.buildNext({
    to: '.',
    search: d => ({
      ...(d ?? {}),
      __data: {
        matchId: routeMatch.id
      }
    })
  });
  const res = await fetch(next.href, {
    method: 'GET',
    signal: routeMatch.abortController.signal
  });
  if (res.ok) {
    return res.json();
  }
  throw new Error('Failed to fetch match data');
};
class Router {
  #unsubHistory;
  startedLoadingAt = Date.now();
  resolveNavigation = () => {};
  constructor(options) {
    this.options = {
      defaultPreloadDelay: 50,
      context: undefined,
      ...options,
      stringifySearch: options?.stringifySearch ?? defaultStringifySearch,
      parseSearch: options?.parseSearch ?? defaultParseSearch,
      fetchServerDataFn: options?.fetchServerDataFn ?? defaultFetchServerDataFn
    };
    this.store = new Store(getInitialRouterState());
    this.basepath = '';
    this.update(options);

    // Allow frameworks to hook into the router creation
    this.options.Router?.(this);
  }
  reset = () => {
    this.store.setState(s => Object.assign(s, getInitialRouterState()));
  };
  mount = () => {
    // Mount only does anything on the client
    if (!isServer) {
      // If the router matches are empty, load the matches
      if (!this.store.state.currentMatches.length) {
        this.load();
      }
      const visibilityChangeEvent = 'visibilitychange';
      const focusEvent = 'focus';

      // addEventListener does not exist in React Native, but window does
      // In the future, we might need to invert control here for more adapters
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (window.addEventListener) {
        // Listen to visibilitychange and focus
        window.addEventListener(visibilityChangeEvent, this.#onFocus, false);
        window.addEventListener(focusEvent, this.#onFocus, false);
      }
      return () => {
        if (window.removeEventListener) {
          // Be sure to unsubscribe if a new handler is set

          window.removeEventListener(visibilityChangeEvent, this.#onFocus);
          window.removeEventListener(focusEvent, this.#onFocus);
        }
      };
    }
    return () => {};
  };
  update = opts => {
    Object.assign(this.options, opts);
    if (!this.history || this.options.history && this.options.history !== this.history) {
      if (this.#unsubHistory) {
        this.#unsubHistory();
      }
      this.history = this.options.history ?? (isServer ? createMemoryHistory() : createBrowserHistory());
      this.store.setState(s => ({
        ...s,
        latestLocation: this.#parseLocation(),
        currentLocation: s.latestLocation
      }));
      this.#unsubHistory = this.history.listen(() => {
        this.load(this.#parseLocation(this.store.state.latestLocation));
      });
    }
    const {
      basepath,
      routeConfig
    } = this.options;
    this.basepath = `/${trimPath(basepath ?? '') ?? ''}`;
    if (routeConfig) {
      this.routesById = {};
      this.routeTree = this.#buildRouteTree(routeConfig);
    }
    return this;
  };
  buildNext = opts => {
    const next = this.#buildLocation(opts);
    const matches = this.matchRoutes(next.pathname);
    const __preSearchFilters = matches.map(match => match.route.options.preSearchFilters ?? []).flat().filter(Boolean);
    const __postSearchFilters = matches.map(match => match.route.options.postSearchFilters ?? []).flat().filter(Boolean);
    return this.#buildLocation({
      ...opts,
      __preSearchFilters,
      __postSearchFilters
    });
  };
  cancelMatches = () => {
    [...this.store.state.currentMatches, ...(this.store.state.pendingMatches || [])].forEach(match => {
      match.cancel();
    });
  };
  load = async next => {
    let now = Date.now();
    const startedAt = now;
    this.startedLoadingAt = startedAt;

    // Cancel any pending matches
    this.cancelMatches();
    let matches;
    this.store.batch(() => {
      if (next) {
        // Ingest the new location
        this.store.setState(s => ({
          ...s,
          latestLocation: next
        }));
      }

      // Match the routes
      matches = this.matchRoutes(this.store.state.latestLocation.pathname, {
        strictParseParams: true
      });
      this.store.setState(s => ({
        ...s,
        status: 'pending',
        pendingMatches: matches,
        pendingLocation: this.store.state.latestLocation
      }));
    });

    // Load the matches
    try {
      await this.loadMatches(matches);
    } catch (err) {
      console.warn(err);
      invariant(false, 'Matches failed to load due to error above ☝️. Navigation cancelled!');
    }
    if (this.startedLoadingAt !== startedAt) {
      // Ignore side-effects of outdated side-effects
      return this.navigationPromise;
    }
    const previousMatches = this.store.state.currentMatches;
    const exiting = [],
      staying = [];
    previousMatches.forEach(d => {
      if (matches.find(dd => dd.id === d.id)) {
        staying.push(d);
      } else {
        exiting.push(d);
      }
    });
    const entering = matches.filter(d => {
      return !previousMatches.find(dd => dd.id === d.id);
    });
    now = Date.now();
    exiting.forEach(d => {
      d.__onExit?.({
        params: d.params,
        search: d.store.state.routeSearch
      });

      // Clear non-loading error states when match leaves
      if (d.store.state.status === 'error') {
        this.store.setState(s => ({
          ...s,
          status: 'idle',
          error: undefined
        }));
      }
    });
    staying.forEach(d => {
      d.route.options.onTransition?.({
        params: d.params,
        search: d.store.state.routeSearch
      });
    });
    entering.forEach(d => {
      d.__onExit = d.route.options.onLoaded?.({
        params: d.params,
        search: d.store.state.search
      });
      // delete this.store.state.matchCache[d.id] // TODO:
    });

    this.store.setState(s => ({
      ...s,
      status: 'idle',
      currentLocation: this.store.state.latestLocation,
      currentMatches: matches,
      pendingLocation: undefined,
      pendingMatches: undefined
    }));
    this.options.onRouteChange?.();
    this.resolveNavigation();
  };
  getRoute = id => {
    const route = this.routesById[id];
    invariant(route, `Route with id "${id}" not found`);
    return route;
  };
  loadRoute = async (navigateOpts = this.store.state.latestLocation) => {
    const next = this.buildNext(navigateOpts);
    const matches = this.matchRoutes(next.pathname, {
      strictParseParams: true
    });
    await this.loadMatches(matches);
    return matches;
  };
  preloadRoute = async (navigateOpts = this.store.state.latestLocation) => {
    const next = this.buildNext(navigateOpts);
    const matches = this.matchRoutes(next.pathname, {
      strictParseParams: true
    });
    await this.loadMatches(matches, {
      preload: true
    });
    return matches;
  };
  matchRoutes = (pathname, opts) => {
    const matches = [];
    if (!this.routeTree) {
      return matches;
    }
    const existingMatches = [...this.store.state.currentMatches, ...(this.store.state.pendingMatches ?? [])];
    const recurse = async routes => {
      const parentMatch = last(matches);
      let params = parentMatch?.params ?? {};
      const filteredRoutes = this.options.filterRoutes?.(routes) ?? routes;
      let foundRoutes = [];
      const findMatchInRoutes = (parentRoutes, routes) => {
        routes.some(route => {
          if (!route.path && route.childRoutes?.length) {
            return findMatchInRoutes([...foundRoutes, route], route.childRoutes);
          }
          const fuzzy = !!(route.path !== '/' || route.childRoutes?.length);
          const matchParams = matchPathname(this.basepath, pathname, {
            to: route.fullPath,
            fuzzy,
            caseSensitive: route.options.caseSensitive ?? this.options.caseSensitive
          });
          if (matchParams) {
            let parsedParams;
            try {
              parsedParams = route.options.parseParams?.(matchParams) ?? matchParams;
            } catch (err) {
              if (opts?.strictParseParams) {
                throw err;
              }
            }
            params = {
              ...params,
              ...parsedParams
            };
          }
          if (!!matchParams) {
            foundRoutes = [...parentRoutes, route];
          }
          return !!foundRoutes.length;
        });
        return !!foundRoutes.length;
      };
      findMatchInRoutes([], filteredRoutes);
      if (!foundRoutes.length) {
        return;
      }
      foundRoutes.forEach(foundRoute => {
        const interpolatedPath = interpolatePath(foundRoute.path, params);
        const matchId = interpolatePath(foundRoute.id, params, true);
        const match = existingMatches.find(d => d.id === matchId) ||
        // this.store.state.matchCache[matchId]?.match || // TODO:
        new RouteMatch(this, foundRoute, {
          id: matchId,
          params,
          pathname: joinPaths([this.basepath, interpolatedPath])
        });
        matches.push(match);
      });
      const foundRoute = last(foundRoutes);
      if (foundRoute.childRoutes?.length) {
        recurse(foundRoute.childRoutes);
      }
    };
    recurse([this.routeTree]);
    linkMatches(matches);
    return matches;
  };
  loadMatches = async (resolvedMatches, loaderOpts) => {
    // this.cleanMatchCache()
    resolvedMatches.forEach(async match => {
      // Validate the match (loads search params etc)
      match.__validate();
    });

    // Check each match middleware to see if the route can be accessed
    await Promise.all(resolvedMatches.map(async match => {
      try {
        await match.route.options.beforeLoad?.({
          router: this,
          match
        });
      } catch (err) {
        if (!loaderOpts?.preload) {
          match.route.options.onLoadError?.(err);
        }
        throw err;
      }
    }));
    const matchPromises = resolvedMatches.map(async (match, index) => {
      const prevMatch = resolvedMatches[1];
      const search = match.store.state.search;
      if (search.__data?.matchId && search.__data.matchId !== match.id) {
        return;
      }
      match.load();
      if (match.store.state.status !== 'success' && match.__loadPromise) {
        // Wait for the first sign of activity from the match
        await match.__loadPromise;
      }
      if (prevMatch) {
        await prevMatch.__loadPromise;
      }
    });
    await Promise.all(matchPromises);
  };
  reload = () => {
    this.navigate({
      fromCurrent: true,
      replace: true,
      search: true
    });
  };
  resolvePath = (from, path) => {
    return resolvePath(this.basepath, from, cleanPath(path));
  };
  navigate = async ({
    from,
    to = '.',
    search,
    hash,
    replace,
    params
  }) => {
    // If this link simply reloads the current route,
    // make sure it has a new key so it will trigger a data refresh

    // If this `to` is a valid external URL, return
    // null for LinkUtils
    const toString = String(to);
    const fromString = typeof from === 'undefined' ? from : String(from);
    let isExternal;
    try {
      new URL(`${toString}`);
      isExternal = true;
    } catch (e) {}
    invariant(!isExternal, 'Attempting to navigate to external url with this.navigate!');
    return this.#commitLocation({
      from: fromString,
      to: toString,
      search,
      hash,
      replace,
      params
    });
  };
  matchRoute = (location, opts) => {
    location = {
      ...location,
      to: location.to ? this.resolvePath(location.from ?? '', location.to) : undefined
    };
    const next = this.buildNext(location);
    if (opts?.pending) {
      if (!this.store.state.pendingLocation) {
        return false;
      }
      return matchPathname(this.basepath, this.store.state.pendingLocation.pathname, {
        ...opts,
        to: next.pathname
      });
    }
    return matchPathname(this.basepath, this.store.state.currentLocation.pathname, {
      ...opts,
      to: next.pathname
    });
  };
  buildLink = ({
    from,
    to = '.',
    search,
    params,
    hash,
    target,
    replace,
    activeOptions,
    preload,
    preloadMaxAge: userPreloadMaxAge,
    preloadGcMaxAge: userPreloadGcMaxAge,
    preloadDelay: userPreloadDelay,
    disabled
  }) => {
    // If this link simply reloads the current route,
    // make sure it has a new key so it will trigger a data refresh

    // If this `to` is a valid external URL, return
    // null for LinkUtils

    try {
      new URL(`${to}`);
      return {
        type: 'external',
        href: to
      };
    } catch (e) {}
    const nextOpts = {
      from,
      to,
      search,
      params,
      hash,
      replace
    };
    const next = this.buildNext(nextOpts);
    preload = preload ?? this.options.defaultPreload;
    const preloadDelay = userPreloadDelay ?? this.options.defaultPreloadDelay ?? 0;

    // Compare path/hash for matches
    const pathIsEqual = this.store.state.currentLocation.pathname === next.pathname;
    const currentPathSplit = this.store.state.currentLocation.pathname.split('/');
    const nextPathSplit = next.pathname.split('/');
    const pathIsFuzzyEqual = nextPathSplit.every((d, i) => d === currentPathSplit[i]);
    const hashIsEqual = this.store.state.currentLocation.hash === next.hash;
    // Combine the matches based on user options
    const pathTest = activeOptions?.exact ? pathIsEqual : pathIsFuzzyEqual;
    const hashTest = activeOptions?.includeHash ? hashIsEqual : true;

    // The final "active" test
    const isActive = pathTest && hashTest;

    // The click handler
    const handleClick = e => {
      if (!disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!target || target === '_self') && e.button === 0) {
        e.preventDefault();

        // All is well? Navigate!
        this.#commitLocation(nextOpts);
      }
    };

    // The click handler
    const handleFocus = e => {
      if (preload) {
        this.preloadRoute(nextOpts).catch(err => {
          console.warn(err);
          console.warn('Error preloading route! ☝️');
        });
      }
    };
    const handleEnter = e => {
      const target = e.target || {};
      if (preload) {
        if (target.preloadTimeout) {
          return;
        }
        target.preloadTimeout = setTimeout(() => {
          target.preloadTimeout = null;
          this.preloadRoute(nextOpts).catch(err => {
            console.warn(err);
            console.warn('Error preloading route! ☝️');
          });
        }, preloadDelay);
      }
    };
    const handleLeave = e => {
      const target = e.target || {};
      if (target.preloadTimeout) {
        clearTimeout(target.preloadTimeout);
        target.preloadTimeout = null;
      }
    };
    return {
      type: 'internal',
      next,
      handleFocus,
      handleClick,
      handleEnter,
      handleLeave,
      isActive,
      disabled
    };
  };
  dehydrate = () => {
    return {
      state: {
        ...pick(this.store.state, ['latestLocation', 'currentLocation', 'status', 'lastUpdated']),
        currentMatches: this.store.state.currentMatches.map(match => ({
          id: match.id,
          state: {
            ...pick(match.store.state, ['status'])
          }
        }))
      },
      context: this.options.context
    };
  };
  hydrate = dehydratedRouter => {
    this.store.setState(s => {
      this.options.context = dehydratedRouter.context;

      // Match the routes
      const currentMatches = this.matchRoutes(dehydratedRouter.state.latestLocation.pathname, {
        strictParseParams: true
      });
      currentMatches.forEach((match, index) => {
        const dehydratedMatch = dehydratedRouter.state.currentMatches[index];
        invariant(dehydratedMatch && dehydratedMatch.id === match.id, 'Oh no! There was a hydration mismatch when attempting to hydrate the state of the router! 😬');
        match.store.setState(s => ({
          ...s,
          ...dehydratedMatch.state
        }));
      });
      currentMatches.forEach(match => match.__validate());
      return {
        ...s,
        ...dehydratedRouter.state,
        currentMatches
      };
    });
  };
  #buildRouteTree = rootRouteConfig => {
    const recurseRoutes = (routeConfigs, parent) => {
      return routeConfigs.map((routeConfig, i) => {
        const routeOptions = routeConfig.options;
        const route = new Route(routeConfig, routeOptions, i, parent, this);
        const existingRoute = this.routesById[route.id];
        if (existingRoute) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Duplicate routes found with id: ${String(route.id)}`, this.routesById, route);
          }
          throw new Error();
        }
        this.routesById[route.id] = route;
        const children = routeConfig.children;
        route.childRoutes = children.length ? recurseRoutes(children, route) : undefined;
        return route;
      });
    };
    const routes = recurseRoutes([rootRouteConfig]);
    return routes[0];
  };
  #parseLocation = previousLocation => {
    let {
      pathname,
      search,
      hash,
      state
    } = this.history.location;
    const parsedSearch = this.options.parseSearch(search);
    return {
      pathname: pathname,
      searchStr: search,
      search: replaceEqualDeep(previousLocation?.search, parsedSearch),
      hash: hash.split('#').reverse()[0] ?? '',
      href: `${pathname}${search}${hash}`,
      state: state,
      key: state?.key || '__init__'
    };
  };
  #onFocus = () => {
    this.load();
  };
  #buildLocation = (dest = {}) => {
    const fromPathname = dest.fromCurrent ? this.store.state.latestLocation.pathname : dest.from ?? this.store.state.latestLocation.pathname;
    let pathname = resolvePath(this.basepath ?? '/', fromPathname, `${dest.to ?? '.'}`);
    const fromMatches = this.matchRoutes(this.store.state.latestLocation.pathname, {
      strictParseParams: true
    });
    const toMatches = this.matchRoutes(pathname);
    const prevParams = {
      ...last(fromMatches)?.params
    };
    let nextParams = (dest.params ?? true) === true ? prevParams : functionalUpdate(dest.params, prevParams);
    if (nextParams) {
      toMatches.map(d => d.route.options.stringifyParams).filter(Boolean).forEach(fn => {
        Object.assign({}, nextParams, fn(nextParams));
      });
    }
    pathname = interpolatePath(pathname, nextParams ?? {});

    // Pre filters first
    const preFilteredSearch = dest.__preSearchFilters?.length ? dest.__preSearchFilters?.reduce((prev, next) => next(prev), this.store.state.latestLocation.search) : this.store.state.latestLocation.search;

    // Then the link/navigate function
    const destSearch = dest.search === true ? preFilteredSearch // Preserve resolvedFrom true
    : dest.search ? functionalUpdate(dest.search, preFilteredSearch) ?? {} // Updater
    : dest.__preSearchFilters?.length ? preFilteredSearch // Preserve resolvedFrom filters
    : {};

    // Then post filters
    const postFilteredSearch = dest.__postSearchFilters?.length ? dest.__postSearchFilters.reduce((prev, next) => next(prev), destSearch) : destSearch;
    const search = replaceEqualDeep(this.store.state.latestLocation.search, postFilteredSearch);
    const searchStr = this.options.stringifySearch(search);
    let hash = dest.hash === true ? this.store.state.latestLocation.hash : functionalUpdate(dest.hash, this.store.state.latestLocation.hash);
    hash = hash ? `#${hash}` : '';
    return {
      pathname,
      search,
      searchStr,
      state: this.store.state.latestLocation.state,
      hash,
      href: `${pathname}${searchStr}${hash}`,
      key: dest.key
    };
  };
  #commitLocation = location => {
    const next = this.buildNext(location);
    const id = '' + Date.now() + Math.random();
    if (this.navigateTimeout) clearTimeout(this.navigateTimeout);
    let nextAction = 'replace';
    if (!location.replace) {
      nextAction = 'push';
    }
    const isSameUrl = this.store.state.latestLocation.href === next.href;
    if (isSameUrl && !next.key) {
      nextAction = 'replace';
    }
    const href = `${next.pathname}${next.searchStr}${next.hash ? `#${next.hash}` : ''}`;
    this.history[nextAction === 'push' ? 'push' : 'replace'](href, {
      id,
      ...next.state
    });

    // this.load(this.#parseLocation(this.store.state.latestLocation))

    return this.navigationPromise = new Promise(resolve => {
      const previousNavigationResolve = this.resolveNavigation;
      this.resolveNavigation = () => {
        previousNavigationResolve();
        resolve();
      };
    });
  };
}

// Detect if we're in the DOM
const isServer = typeof window === 'undefined' || !window.document.createElement;
function getInitialRouterState() {
  return {
    status: 'idle',
    latestLocation: null,
    currentLocation: null,
    currentMatches: [],
    lastUpdated: Date.now()
    // matchCache: {}, // TODO:
    // get isFetching() {
    //   return (
    //     this.status === 'loading' ||
    //     this.currentMatches.some((d) => d.store.state.isFetching)
    //   )
    // },
    // get isPreloading() {
    //   return Object.values(this.matchCache).some(
    //     (d) =>
    //       d.match.store.state.isFetching &&
    //       !this.currentMatches.find((dd) => dd.id === d.match.id),
    //   )
    // },
  };
}

function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function linkMatches(matches) {
  matches.forEach((match, index) => {
    const parent = matches[index - 1];
    if (parent) {
      match.__setParentMatch(parent);
    }
  });
}

export { Route, RouteMatch, Router, cleanPath, createBrowserHistory, createHashHistory, createMemoryHistory, createRouteConfig, decode, defaultFetchServerDataFn, defaultParseSearch, defaultStringifySearch, encode, functionalUpdate, interpolatePath, isPlainObject, joinPaths, last, matchByPath, matchPathname, parsePathname, parseSearchWith, pick, replaceEqualDeep, resolvePath, rootRouteId, stringifySearchWith, trimPath, trimPathLeft, trimPathRight, warning };
//# sourceMappingURL=index.js.map
