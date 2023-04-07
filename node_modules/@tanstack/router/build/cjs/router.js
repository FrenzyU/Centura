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
var invariant = require('tiny-invariant');
var path = require('./path.js');
var route = require('./route.js');
var routeMatch = require('./routeMatch.js');
var searchParams = require('./searchParams.js');
var utils = require('./utils.js');
var history = require('./history.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

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
      stringifySearch: options?.stringifySearch ?? searchParams.defaultStringifySearch,
      parseSearch: options?.parseSearch ?? searchParams.defaultParseSearch,
      fetchServerDataFn: options?.fetchServerDataFn ?? defaultFetchServerDataFn
    };
    this.store = new store.Store(getInitialRouterState());
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
      this.history = this.options.history ?? (isServer ? history.createMemoryHistory() : history.createBrowserHistory());
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
    this.basepath = `/${path.trimPath(basepath ?? '') ?? ''}`;
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
      invariant__default["default"](false, 'Matches failed to load due to error above ☝️. Navigation cancelled!');
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
    invariant__default["default"](route, `Route with id "${id}" not found`);
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
      const parentMatch = utils.last(matches);
      let params = parentMatch?.params ?? {};
      const filteredRoutes = this.options.filterRoutes?.(routes) ?? routes;
      let foundRoutes = [];
      const findMatchInRoutes = (parentRoutes, routes) => {
        routes.some(route => {
          if (!route.path && route.childRoutes?.length) {
            return findMatchInRoutes([...foundRoutes, route], route.childRoutes);
          }
          const fuzzy = !!(route.path !== '/' || route.childRoutes?.length);
          const matchParams = path.matchPathname(this.basepath, pathname, {
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
        const interpolatedPath = path.interpolatePath(foundRoute.path, params);
        const matchId = path.interpolatePath(foundRoute.id, params, true);
        const match = existingMatches.find(d => d.id === matchId) ||
        // this.store.state.matchCache[matchId]?.match || // TODO:
        new routeMatch.RouteMatch(this, foundRoute, {
          id: matchId,
          params,
          pathname: path.joinPaths([this.basepath, interpolatedPath])
        });
        matches.push(match);
      });
      const foundRoute = utils.last(foundRoutes);
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
  resolvePath = (from, path$1) => {
    return path.resolvePath(this.basepath, from, path.cleanPath(path$1));
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
    invariant__default["default"](!isExternal, 'Attempting to navigate to external url with this.navigate!');
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
      return path.matchPathname(this.basepath, this.store.state.pendingLocation.pathname, {
        ...opts,
        to: next.pathname
      });
    }
    return path.matchPathname(this.basepath, this.store.state.currentLocation.pathname, {
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
        ...utils.pick(this.store.state, ['latestLocation', 'currentLocation', 'status', 'lastUpdated']),
        currentMatches: this.store.state.currentMatches.map(match => ({
          id: match.id,
          state: {
            ...utils.pick(match.store.state, ['status'])
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
        invariant__default["default"](dehydratedMatch && dehydratedMatch.id === match.id, 'Oh no! There was a hydration mismatch when attempting to hydrate the state of the router! 😬');
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
        const route$1 = new route.Route(routeConfig, routeOptions, i, parent, this);
        const existingRoute = this.routesById[route$1.id];
        if (existingRoute) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Duplicate routes found with id: ${String(route$1.id)}`, this.routesById, route$1);
          }
          throw new Error();
        }
        this.routesById[route$1.id] = route$1;
        const children = routeConfig.children;
        route$1.childRoutes = children.length ? recurseRoutes(children, route$1) : undefined;
        return route$1;
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
      search: utils.replaceEqualDeep(previousLocation?.search, parsedSearch),
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
    let pathname = path.resolvePath(this.basepath ?? '/', fromPathname, `${dest.to ?? '.'}`);
    const fromMatches = this.matchRoutes(this.store.state.latestLocation.pathname, {
      strictParseParams: true
    });
    const toMatches = this.matchRoutes(pathname);
    const prevParams = {
      ...utils.last(fromMatches)?.params
    };
    let nextParams = (dest.params ?? true) === true ? prevParams : utils.functionalUpdate(dest.params, prevParams);
    if (nextParams) {
      toMatches.map(d => d.route.options.stringifyParams).filter(Boolean).forEach(fn => {
        Object.assign({}, nextParams, fn(nextParams));
      });
    }
    pathname = path.interpolatePath(pathname, nextParams ?? {});

    // Pre filters first
    const preFilteredSearch = dest.__preSearchFilters?.length ? dest.__preSearchFilters?.reduce((prev, next) => next(prev), this.store.state.latestLocation.search) : this.store.state.latestLocation.search;

    // Then the link/navigate function
    const destSearch = dest.search === true ? preFilteredSearch // Preserve resolvedFrom true
    : dest.search ? utils.functionalUpdate(dest.search, preFilteredSearch) ?? {} // Updater
    : dest.__preSearchFilters?.length ? preFilteredSearch // Preserve resolvedFrom filters
    : {};

    // Then post filters
    const postFilteredSearch = dest.__postSearchFilters?.length ? dest.__postSearchFilters.reduce((prev, next) => next(prev), destSearch) : destSearch;
    const search = utils.replaceEqualDeep(this.store.state.latestLocation.search, postFilteredSearch);
    const searchStr = this.options.stringifySearch(search);
    let hash = dest.hash === true ? this.store.state.latestLocation.hash : utils.functionalUpdate(dest.hash, this.store.state.latestLocation.hash);
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

exports.Router = Router;
exports.defaultFetchServerDataFn = defaultFetchServerDataFn;
//# sourceMappingURL=router.js.map
