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
var path = require('./path.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);

const rootRouteId = '__root__';
const createRouteConfig = (options = {}, children = [], isRoot = true, parentId, parentPath) => {
  if (isRoot) {
    options.path = rootRouteId;
  }

  // Strip the root from parentIds
  if (parentId === rootRouteId) {
    parentId = '';
  }
  let path$1 = isRoot ? rootRouteId : options.path;

  // If the path is anything other than an index path, trim it up
  if (path$1 && path$1 !== '/') {
    path$1 = path.trimPath(path$1);
  }
  const routeId = path$1 || options.id;
  let id = path.joinPaths([parentId, routeId]);
  if (path$1 === rootRouteId) {
    path$1 = '/';
  }
  if (id !== rootRouteId) {
    id = path.joinPaths(['/', id]);
  }
  const fullPath = id === rootRouteId ? '/' : path.trimPathRight(path.joinPaths([parentPath, path$1]));
  return {
    id: id,
    routeId: routeId,
    path: path$1,
    fullPath: fullPath,
    options: options,
    children,
    addChildren: children => createRouteConfig(options, children, false, parentId, parentPath),
    createRoute: childOptions => createRouteConfig(childOptions, undefined, false, id, fullPath),
    generate: () => {
      invariant__default["default"](false, `routeConfig.generate() is used by TanStack Router's file-based routing code generation and should not actually be called during runtime. `);
    }
  };
};

exports.createRouteConfig = createRouteConfig;
exports.rootRouteId = rootRouteId;
//# sourceMappingURL=routeConfig.js.map
