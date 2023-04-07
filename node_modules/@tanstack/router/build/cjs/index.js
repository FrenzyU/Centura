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

var invariant = require('tiny-invariant');
var history = require('./history.js');
var path = require('./path.js');
var qss = require('./qss.js');
var route = require('./route.js');
var routeConfig = require('./routeConfig.js');
var routeMatch = require('./routeMatch.js');
var router = require('./router.js');
var searchParams = require('./searchParams.js');
var utils = require('./utils.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);



Object.defineProperty(exports, 'invariant', {
	enumerable: true,
	get: function () { return invariant__default["default"]; }
});
exports.createBrowserHistory = history.createBrowserHistory;
exports.createHashHistory = history.createHashHistory;
exports.createMemoryHistory = history.createMemoryHistory;
exports.cleanPath = path.cleanPath;
exports.interpolatePath = path.interpolatePath;
exports.joinPaths = path.joinPaths;
exports.matchByPath = path.matchByPath;
exports.matchPathname = path.matchPathname;
exports.parsePathname = path.parsePathname;
exports.resolvePath = path.resolvePath;
exports.trimPath = path.trimPath;
exports.trimPathLeft = path.trimPathLeft;
exports.trimPathRight = path.trimPathRight;
exports.decode = qss.decode;
exports.encode = qss.encode;
exports.Route = route.Route;
exports.createRouteConfig = routeConfig.createRouteConfig;
exports.rootRouteId = routeConfig.rootRouteId;
exports.RouteMatch = routeMatch.RouteMatch;
exports.Router = router.Router;
exports.defaultFetchServerDataFn = router.defaultFetchServerDataFn;
exports.defaultParseSearch = searchParams.defaultParseSearch;
exports.defaultStringifySearch = searchParams.defaultStringifySearch;
exports.parseSearchWith = searchParams.parseSearchWith;
exports.stringifySearchWith = searchParams.stringifySearchWith;
exports.functionalUpdate = utils.functionalUpdate;
exports.isPlainObject = utils.isPlainObject;
exports.last = utils.last;
exports.pick = utils.pick;
exports.replaceEqualDeep = utils.replaceEqualDeep;
exports.warning = utils.warning;
//# sourceMappingURL=index.js.map
