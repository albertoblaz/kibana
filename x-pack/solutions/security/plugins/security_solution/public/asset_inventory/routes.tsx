/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { lazy, Suspense } from 'react';
import { EuiLoadingSpinner } from '@elastic/eui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDataView } from '@kbn/cloud-security-posture/src/hooks/use_data_view';
import type { DataTableRecord } from '@kbn/discover-utils/types';
import type { SecuritySubPluginRoutes } from '../app/types';
import { SecurityPageName } from '../app/types';
import { ASSET_INVENTORY_PATH } from '../../common/constants';
import { SecuritySolutionPageWrapper } from '../common/components/page_wrapper';
import { PluginTemplateWrapper } from '../common/components/plugin_template_wrapper';
import { SecurityRoutePageWrapper } from '../common/components/security_route_page_wrapper';
import { DataViewContext } from './hooks/data_view_context';
import { useArchivedData } from './hooks/use_archived_data';
import { mockData } from './sample_data';
import { DEFAULT_VISIBLE_ROWS_PER_PAGE, ASSET_INVENTORY_DATA_VIEW } from './constants';

const AllAssetsLazy = lazy(() => import('./pages/all_assets'));

const rows = [
  ...mockData,
  ...mockData,
  ...mockData,
  ...mockData,
  ...mockData,
  ...mockData,
  ...mockData,
] as typeof mockData;

// Initializing react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const getRowsFromPages = (data: Array<{ page: DataTableRecord[] }> | undefined) =>
  data
    ?.map(({ page }: { page: DataTableRecord[] }) => {
      return page;
    })
    .flat() || [];

export const AssetInventoryRoutes = () => {
  const dataViewQuery = useDataView(ASSET_INVENTORY_DATA_VIEW);

  const dataViewContextValue = {
    dataView: dataViewQuery.data!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    dataViewRefetch: dataViewQuery.refetch,
    dataViewIsLoading: dataViewQuery.isLoading,
    dataViewIsRefetching: dataViewQuery.isRefetching,
  };

  const {
    data,
    // error: fetchError,
    isFetching,
    fetchNextPage,
    isLoading,
  } = useArchivedData({
    sort: [['@timestamp', 'desc']],
    enabled: true,
    pageSize: DEFAULT_VISIBLE_ROWS_PER_PAGE,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <PluginTemplateWrapper>
        <SecurityRoutePageWrapper pageName={SecurityPageName.assetInventory}>
          <DataViewContext.Provider value={dataViewContextValue}>
            <SecuritySolutionPageWrapper noPadding>
              <Suspense fallback={<EuiLoadingSpinner />}>
                <AllAssetsLazy
                  // rows={data ? getRowsFromPages(data?.pages) : []}
                  rows={getRowsFromPages(data?.pages)}
                  isLoading={isLoading || isFetching}
                  loadMore={fetchNextPage}
                  flyoutComponent={() => <></>}
                />
              </Suspense>
            </SecuritySolutionPageWrapper>
          </DataViewContext.Provider>
        </SecurityRoutePageWrapper>
      </PluginTemplateWrapper>
    </QueryClientProvider>
  );
};

export const routes: SecuritySubPluginRoutes = [
  {
    path: ASSET_INVENTORY_PATH,
    component: AssetInventoryRoutes,
  },
];
