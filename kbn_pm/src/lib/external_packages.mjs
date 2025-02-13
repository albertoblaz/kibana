/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */
// const module = import('@kbn/babel-register');
import babelRegister from '@kbn/babel-register';
babelRegister.install();

export const packages = {
  /** @returns {import('@kbn/repo-packages')} */
  ['@kbn/repo-packages']() {
    // we need to load this package before we install node modules so we can't use @kbn/* imports here
    // eslint-disable-next-line import/no-dynamic-require
    return import('../../../src/platform/packages/private/kbn-repo-packages');
  },

  ['@kbn/ci-stats-reporter']() {
    return import('@kbn/ci-stats-reporter');
  },

  ['@kbn/yarn-lock-validator']() {
    return import('@kbn/yarn-lock-validator');
  },

  ['@kbn/sort-package-json']() {
    return import('@kbn/sort-package-json');
  },

  ['@kbn/get-repo-files']() {
    return import('@kbn/get-repo-files');
  },
};
