/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Logger } from '@kbn/core/server';
import type { SecuritySolutionPluginRouter } from '../../types';
import type { ConfigType } from '../../config';

export interface AssetInventoryRoutesDeps {
  router: SecuritySolutionPluginRouter;
  logger: Logger;
  config: ConfigType;
}

export interface AssetBucket {
  key: string | undefined;
  doc_count?: number;
  category: {
    doc_count_error_upper_bound: number;
    sum_other_doc_count: number;
    buckets: Array<{
      key?: string;
      doc_count?: string;
    }>;
  };
  source: {
    doc_count_error_upper_bound: number;
    sum_other_doc_count: number;
    buckets: Array<{
      key?: string;
      doc_count?: string;
    }>;
  };
}

export interface AssetsQueryResult {
  assets: {
    buckets: AssetBucket[];
  };
}
