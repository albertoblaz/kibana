/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { lastValueFrom } from 'rxjs';
import { number } from 'io-ts';
import type * as estypes from '@elastic/elasticsearch/lib/api/types';
import { buildDataTableRecord } from '@kbn/discover-utils';
import type { EsHitRecord } from '@kbn/discover-utils/types';
import type { RuntimePrimitiveTypes } from '@kbn/data-views-plugin/common';
import type { CspBenchmarkRulesStates } from '@kbn/cloud-security-posture-common/schema/rules/latest';
import { showErrorToast } from '@kbn/cloud-security-posture';
import type { IKibanaSearchResponse, IKibanaSearchRequest } from '@kbn/search-types';
import { useGetCspBenchmarkRulesStatesApi } from '@kbn/cloud-security-posture/src/hooks/use_get_benchmark_rules_state_api';
import type { FindingsBaseEsQuery } from '@kbn/cloud-security-posture';
// import { useKibana } from '../../../common/hooks/use_kibana';
import { useKibana } from '../../common/lib/kibana';
import { MAX_ASSETS_TO_LOAD } from '../constants';

interface UseAssetsOptions extends FindingsBaseEsQuery {
  sort: string[][];
  enabled: boolean;
  pageSize: number;
}

// const getMultiFieldsSort = (sort: string[][]) => {
//   return sort.map(([id, direction]) => {
//     return {
//       ...getSortField({ field: id, direction }),
//     };
//   });
// };

/**
 * By default, ES will sort keyword fields in case-sensitive format, the
 * following fields are required to have a case-insensitive sorting.
 */
// const fieldsRequiredSortingByPainlessScript = ['asset.risk', 'asset.criticality', 'asset.name'];

/**
 * Generates Painless sorting if the given field is matched or returns default sorting
 * This painless script will sort the field in case-insensitive manner
 */
// const getSortField = ({ field, direction }: { field: string; direction: string }) => {
//   if (fieldsRequiredSortingByPainlessScript.includes(field)) {
//     return {
//       _script: {
//         type: 'string',
//         order: direction,
//         script: {
//           source: `doc["${field}"].value.toLowerCase()`,
//           lang: 'painless',
//         },
//       },
//     };
//   }
//   return { [field]: direction };
// };

const ASSET_INVENTORY_INDEX_PATTERN =
  'logs-cloud_security_posture.findings_latest-default,logs-cloud_security_posture.scores-default,logs-cloud_security_posture.vulnerabilities_latest-default,logs-cloud_*';

export const ASSET_INVENTORY_TABLE_RUNTIME_MAPPING_FIELDS: string[] = ['asset.risk', 'asset.name'];

const getRuntimeMappingsFromSort = (sort: string[][]) => {
  return sort
    .filter(([field]) => ASSET_INVENTORY_TABLE_RUNTIME_MAPPING_FIELDS.includes(field))
    .reduce((acc, [field]) => {
      const type: RuntimePrimitiveTypes = 'keyword';

      return {
        ...acc,
        [field]: {
          type,
        },
      };
    }, {});
};

const getAssetsQuery = (
  { query, sort }: UseAssetsOptions,
  rulesStates: CspBenchmarkRulesStates,
  pageParam: unknown
) => {
  return {
    index: ASSET_INVENTORY_INDEX_PATTERN,
    sort: [{ '@timestamp': 'desc' }],
    runtime_mappings: getRuntimeMappingsFromSort(sort),
    size: MAX_ASSETS_TO_LOAD,
    aggs: {
      count: {
        terms: {
          field: 'asset.name',
        },
      },
    },
    ignore_unavailable: true,
    query: {
      bool: {
        must: [],
        filter: [
          {
            range: {
              '@timestamp': {
                gte: 'now-90d',
                lte: 'now',
              },
            },
          },
        ],
        should: [],
        must_not: [],
      },
    },
  };
};

interface Asset {
  '@timestamp': string;
  name: string;
  risk: number;
  criticality: string;
  category: string;
}

interface AssetsAggs {
  count: estypes.AggregationsMultiBucketAggregateBase<estypes.AggregationsStringRareTermsBucketKeys>;
}

type LatestAssetsRequest = IKibanaSearchRequest<estypes.SearchRequest>;
type LatestAssetsResponse = IKibanaSearchResponse<estypes.SearchResponse<Asset, AssetsAggs>>;

const getAggregationCount = (
  buckets: Array<estypes.AggregationsStringRareTermsBucketKeys | undefined>
) => {
  const passed = buckets.find((bucket) => bucket?.key === 'passed');
  const failed = buckets.find((bucket) => bucket?.key === 'failed');

  return {
    passed: passed?.doc_count || 0,
    failed: failed?.doc_count || 0,
  };
};

export function useArchivedData(options: UseAssetsOptions) {
  const {
    data,
    notifications: { toasts },
  } = useKibana().services;
  const { data: rulesStates } = useGetCspBenchmarkRulesStatesApi();

  return useInfiniteQuery(
    ['csp_findings', { params: options }, rulesStates],
    async ({ pageParam }) => {
      const {
        rawResponse: { hits, aggregations },
      } = await lastValueFrom(
        data.search.search<LatestAssetsRequest, LatestAssetsResponse>({
          // ruleStates always exists since it under the `enabled` dependency.
          params: getAssetsQuery(options, rulesStates!, pageParam) as LatestAssetsRequest['params'], // eslint-disable-line @typescript-eslint/no-non-null-assertion
        })
      );
      if (!aggregations) throw new Error('expected aggregations to be an defined');
      if (!Array.isArray(aggregations.count.buckets))
        throw new Error('expected buckets to be an array');

      return {
        page: hits.hits.map((hit) => buildDataTableRecord(hit as EsHitRecord)),
        total: number.is(hits.total) ? hits.total : 0,
        count: getAggregationCount(aggregations.count.buckets),
      };
    },
    {
      enabled: options.enabled && !!rulesStates,
      keepPreviousData: true,
      onError: (err: Error) => showErrorToast(toasts, err),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.page.length < options.pageSize) {
          return undefined;
        }
        return allPages.length * options.pageSize;
      },
    }
  );
}
