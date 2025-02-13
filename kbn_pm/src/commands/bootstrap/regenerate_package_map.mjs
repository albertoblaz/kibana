/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

// import { packages } from '../../lib/external_packages.mjs';
import { REPO_ROOT } from '../../lib/paths.mjs';

import { updatePackageMap, getPackages } from '@kbn/repo-packages';

/**
 * @param {import('@kbn/some-dev-log').SomeDevLog} log
 * @param {string[]} packageManifestPaths
 */
export async function regeneratePackageMap(log, packageManifestPaths) {
  // const { updatePackageMap, getPackages } = packages['@kbn/repo-packages']();

  if (updatePackageMap(REPO_ROOT, packageManifestPaths)) {
    log.warning('updated package map');
  }

  return getPackages(REPO_ROOT);
}
