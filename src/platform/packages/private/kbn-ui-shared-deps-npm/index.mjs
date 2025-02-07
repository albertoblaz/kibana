/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

/**
 * @typedef {'v8'} ThemeVersion
 */

import Fs from 'fs';
import Path from 'path';
import { fileURLToPath } from 'url';
import { REPO_ROOT } from '@kbn/repo-info';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const localDist = Path.resolve(__dirname, './shared_built_assets');
const bazelDist = Path.resolve(REPO_ROOT, 'bazel-bin', Path.relative(REPO_ROOT, localDist));

// extracted const vars
const distDir = Fs.existsSync(localDist) ? localDist : bazelDist;
const dllManifestPath = Path.resolve(distDir, 'kbn-ui-shared-deps-npm-manifest.json');
const dllFilename = 'kbn-ui-shared-deps-npm.dll.js';
import publicPathLoader from './src/public_path_loader';

module.exports = {
  /**
   * Absolute path to the distributable directory
   */
  distDir,

  /**
   * Path to dll manifest of modules included in this bundle
   */
  dllManifestPath,

  /**
   * Filename of the main bundle file in the distributable directory
   */
  dllFilename,

  /**
   * Webpack loader for configuring the public path lookup from `window.__kbnPublicPath__`.
   */
  publicPathLoader,
};
