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

exports.Route = Route;
//# sourceMappingURL=route.js.map
