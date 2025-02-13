/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ApmDataAccessServices, APMEventClient } from '@kbn/apm-data-access-plugin/server';
import type { MinimalAPMRouteHandlerResources } from '../../routes/apm_routes/register_apm_server_routes';

export async function getApmDataAccessServices({
  apmEventClient,
  plugins,
}: {
  apmEventClient: APMEventClient;
} & Pick<MinimalAPMRouteHandlerResources, 'plugins'>): Promise<ApmDataAccessServices> {
  const { apmDataAccess } = plugins;
  return apmDataAccess.setup.getServices({
    apmEventClient,
  });
}
