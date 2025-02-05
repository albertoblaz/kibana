/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

/** @typedef {import('./modern/types').PluginPackage} PluginPackage */
/** @typedef {import('./modern/types').PluginSelector} PluginSelector */
/** @typedef {import('./modern/types').KibanaPackageManifest} KibanaPackageManifest */
/** @typedef {import('./modern/types').PluginPackageManifest} PluginPackageManifest */
/** @typedef {import('./modern/types').SharedBrowserPackageManifest} SharedBrowserPackageManifest */
/** @typedef {import('./modern/types').BasePackageManifest} BasePackageManifest */
/** @typedef {import('./modern/types').KibanaPackageType} KibanaPackageType */
/** @typedef {import('./modern/types').ParsedPackageJson} ParsedPackageJson */
/** @typedef {import('./modern/types').KbnImportReq} KbnImportReq */
/** @typedef {import('./modern/types').PluginCategoryInfo} PluginCategoryInfo */
/** @typedef {Map<string, string>} PackageMap */
/** @typedef {import('./modern/get_packages').PkgDirMap} PkgDirMap */

export {
  getPackages,
  findPackageForPath,
  getPkgDirMap,
  getPkgsById,
  updatePackageMap,
  readHashOfPackageMap,
  readPackageMap,
} from './modern/get_packages.mjs';
export { readPackageManifest } from './modern/parse_package_manifest.mjs';
export { Package } from './modern/package.mjs';
export { parseKbnImportReq } from './modern/parse_kbn_import_req.mjs';
export { getRepoRels, getRepoRelsSync } from './modern/get_repo_rels.mjs';
export { getPluginPackagesFilter, getPluginSearchPaths } from './modern/plugins.mjs';
export { readPackageJson } from './modern/parse_package_json.mjs';

import * as Jsonc from './utils/jsonc.mjs';
export { Jsonc };
