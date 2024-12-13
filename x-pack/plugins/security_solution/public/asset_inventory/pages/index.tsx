/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useMemo } from 'react';
import { getEsQueryConfig } from '@kbn/data-plugin/common';
import { SecuritySolutionPageWrapper } from '../../common/components/page_wrapper';
import { useKibana } from '../../common/lib/kibana';
import { SecurityPageName } from '../../../common/constants';
import { SpyRoute } from '../../common/utils/route/spy_routes';
import { inputsSelectors } from '../../common/store';
import { useSourcererDataView } from '../../sourcerer/containers';
import { useGlobalTime } from '../../common/containers/use_global_time';
import { useDeepEqualSelector } from '../../common/hooks/use_selector';
import { convertToBuildEsQuery } from '../../common/lib/kuery';
import { useInvalidFilterQuery } from '../../common/hooks/use_invalid_filter_query';

export const AssetInventoryContainer = React.memo(() => {
  const { assetInventory, uiSettings } = useKibana().services;

  const { sourcererDataView } = useSourcererDataView();
  const { from, to } = useGlobalTime();

  const getGlobalFiltersQuerySelector = useMemo(
    () => inputsSelectors.globalFiltersQuerySelector(),
    []
  );
  const getGlobalQuerySelector = useMemo(() => inputsSelectors.globalQuerySelector(), []);
  const query = useDeepEqualSelector(getGlobalQuerySelector);
  const filters = useDeepEqualSelector(getGlobalFiltersQuerySelector);

  const [filterQuery, kqlError] = useMemo(
    () =>
      convertToBuildEsQuery({
        config: getEsQueryConfig(uiSettings),
        dataViewSpec: sourcererDataView,
        queries: [query],
        filters,
      }),
    [filters, sourcererDataView, uiSettings, query]
  );

  useInvalidFilterQuery({
    id: 'assetInventoryQuery',
    filterQuery,
    kqlError,
    query,
    startDate: from,
    endDate: to,
  });

  return (
    <SecuritySolutionPageWrapper noPadding>
      {assetInventory.getAssetInventoryPage({})}
      <SpyRoute pageName={SecurityPageName.assetInventory} />
    </SecuritySolutionPageWrapper>
  );
});

AssetInventoryContainer.displayName = 'AssetInventoryContainer';
