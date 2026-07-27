import { test, expect } from '@grafana/plugin-e2e';

test('smoke: should render query editor with dropdowns', async ({ panelEditPage, readProvisionedDataSource }) => {
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);
  const queryRow = panelEditPage.getQueryEditorRow('A');
  await expect(queryRow.getByTestId('query-editor-channel')).toBeVisible();
  await expect(queryRow.getByTestId('query-editor-source')).toBeVisible();
});
