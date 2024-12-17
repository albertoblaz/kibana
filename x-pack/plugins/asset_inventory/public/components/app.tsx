/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { FormattedMessage, I18nProvider } from '@kbn/i18n-react';
import { EuiPageTemplate, EuiTitle } from '@elastic/eui';
import {
  DataGridDensity,
  UnifiedDataTableSettings,
  UnifiedDataTableSettingsColumn,
  UnifiedDataTable,
  DataLoadingState,
  useColumns,
} from '@kbn/unified-data-table';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { SHOW_MULTIFIELDS, SORT_DEFAULT_ORDER_SETTING } from '@kbn/discover-utils';

const MAX_ASSETS_TO_LOAD = 500;

const AssetInventoryApp = () => {
  const {
    uiSettings,
    uiActions,
    dataViews,
    data,
    application,
    theme,
    fieldFormats,
    toastNotifications,
    storage,
  } = useKibana().services;

  // const styles = useStyles();

  const { capabilities } = application;
  const { filterManager } = data.query;

  const services = {
    theme,
    fieldFormats,
    uiSettings,
    toastNotifications,
    storage,
    data,
  };

  const {
    columns: currentColumns,
    onSetColumns,
    onAddColumn,
    onRemoveColumn,
  } = useColumns({
    capabilities,
    defaultOrder: uiSettings.get(SORT_DEFAULT_ORDER_SETTING),
    dataView: [], // TODO Revert this
    dataViews,
    setAppState: (props) => setColumns(props.columns),
    columns,
    sort,
  });

  const onAddFilter: AddFieldFilterHandler | undefined = useMemo(
    () =>
      filterManager && dataView
        ? (clickedField, values, operation) => {
            const newFilters = generateFilters(
              filterManager,
              clickedField,
              values,
              operation,
              dataView
            );
            filterManager.addFilters(newFilters);
            setUrlQuery({
              filters: filterManager.getFilters(),
            });
          }
        : undefined,
    [dataView, filterManager, setUrlQuery]
  );

  const onResize = (colSettings: { columnId: string; width: number | undefined }) => {
    const grid = persistedSettings || {};
    const newColumns = { ...(grid.columns || {}) };
    newColumns[colSettings.columnId] = colSettings.width
      ? { width: Math.round(colSettings.width) }
      : {};
    const newGrid = { ...grid, columns: newColumns };
    setPersistedSettings(newGrid);
  };

  const externalCustomRenderers = useMemo(() => {
    if (!customCellRenderer) {
      return undefined;
    }
    return customCellRenderer(rows);
  }, [customCellRenderer, rows]);

  const onResetColumns = () => {
    setColumns(defaultColumns.map((c) => c.id));
  };

  if (!isLoading && !rows.length) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  const externalAdditionalControls = (
    <AdditionalControls
      total={total}
      dataView={dataView}
      title={title}
      columns={currentColumns}
      onAddColumn={onAddColumn}
      onRemoveColumn={onRemoveColumn}
      groupSelectorComponent={groupSelectorComponent}
      onResetColumns={onResetColumns}
    />
  );

  const externalControlColumns: EuiDataGridControlColumn[] | undefined = createRuleFn
    ? [
        {
          id: 'select',
          width: 20,
          headerCellRender: () => null,
          rowCellRender: ({ rowIndex }) =>
            createRuleFn && (
              <TakeAction isDataGridControlColumn createRuleFn={createRuleFn(rowIndex)} />
            ),
        },
      ]
    : undefined;

  const rowHeightState = 0;

  const loadingStyle = {
    opacity: isLoading ? 1 : 0,
  };

  const loadingState =
    isLoading || dataViewIsRefetching ? DataLoadingState.loading : DataLoadingState.loaded;

  return (
    <I18nProvider>
      <>
        <EuiPageTemplate restrictWidth="1000px">
          <EuiPageTemplate.Header>
            <EuiTitle size="l">
              <h1>
                <FormattedMessage id="assetInventory.allAssets" defaultMessage="All assets" />
              </h1>
            </EuiTitle>
          </EuiPageTemplate.Header>
          <EuiPageTemplate.Section>
            <UnifiedDataTable
              key={computeDataTableRendering.mode}
              className={styles.gridStyle}
              ariaLabelledBy={title}
              columns={currentColumns}
              expandedDoc={expandedDoc}
              dataView={dataView}
              loadingState={loadingState}
              onFilter={onAddFilter as DocViewFilterFn}
              onResize={onResize}
              onSetColumns={onSetColumns}
              onSort={onSort}
              rows={rows}
              sampleSizeState={MAX_ASSETS_TO_LOAD}
              setExpandedDoc={setExpandedDoc}
              renderDocumentView={renderDocumentView}
              sort={sort}
              rowsPerPageState={pageSize}
              totalHits={total}
              services={services}
              onUpdateRowsPerPage={onChangeItemsPerPage}
              rowHeightState={rowHeightState}
              showMultiFields={uiSettings.get(SHOW_MULTIFIELDS)}
              showTimeCol={false}
              settings={settings}
              onFetchMoreRecords={loadMore}
              externalControlColumns={externalControlColumns}
              externalCustomRenderers={externalCustomRenderers}
              externalAdditionalControls={externalAdditionalControls}
              gridStyleOverride={gridStyle}
              rowLineHeightOverride="24px"
              controlColumnIds={controlColumnIds}
              dataGridDensityState={DataGridDensity.EXPANDED}
            />
          </EuiPageTemplate.Section>
        </EuiPageTemplate>
      </>
    </I18nProvider>
  );
};

//  we need to use default exports to import it via React.lazy
export default AssetInventoryApp; // eslint-disable-line import/no-default-export
