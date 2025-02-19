/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { buildSiemResponse } from '@kbn/lists-plugin/server/routes/utils';
import { transformError } from '@kbn/securitysolution-es-utils';
import type { Logger } from '@kbn/core/server';
import type { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { API_VERSIONS } from '../../../../common/constants';

import type { AssetInventoryRoutesDeps } from '../types';

const getTopAssetsQuery = (): SearchRequest => ({
  size: 0,
  query: {
    match_all: {},
  },
  // TODO Replace hard-coded index pattern with constant from shared/ folder
  index: 'logs-cloud_asset_inventory.asset_inventory-*',
  aggs: {
    vulnerabilities: {
      terms: {
        field: 'entity.id',
        order: {
          _count: 'desc',
        },
        size: 10,
      },
      aggs: {
        category: {
          terms: {
            field: 'entity.category',
          },
        },
        source: {
          terms: {
            field: 'entity.type',
          },
        },
        // score: {
        //   max: {
        //     field: 'vulnerability.score.base',
        //   },
        // },
        // cveVersion: {
        //   terms: {
        //     field: 'vulnerability.score.version',
        //   },
        // },
        // severity: {
        //   terms: {
        //     field: 'vulnerability.severity',
        //     size: 1,
        //   },
        // },
        // packageFixVersion: {
        //   terms: {
        //     field: 'package.fixed_version',
        //     size: 1,
        //   },
        // },
        // packageName: {
        //   terms: {
        //     field: 'package.name',
        //     size: 1,
        //   },
        // },
        // packageVersion: {
        //   terms: {
        //     field: 'package.version',
        //     size: 1,
        //   },
        // },
      },
    },
  },
});

export const topAssetsRoute = (router: AssetInventoryRoutesDeps['router'], logger: Logger) => {
  router.versioned
    .post({
      access: 'public',
      path: '/api/asset_inventory/top_assets',
      security: {
        authz: {
          requiredPrivileges: ['securitySolution'],
        },
      },
    })
    .addVersion(
      {
        version: API_VERSIONS.public.v1,
        // TODO: create validation
        validate: false,
      },

      async (context, request, response) => {
        const siemResponse = buildSiemResponse(response);
        const secSol = await context.securitySolution;

        try {
          const body = await secSol.getAssetInventoryClient().topAssets(getTopAssetsQuery);

          return response.ok({ body });
        } catch (e) {
          const error = transformError(e);
          logger.error(`Error initializing asset inventory: ${error.message}`);
          return siemResponse.error({
            statusCode: error.statusCode,
            body: error.message,
          });
        }
      }
    );
};
