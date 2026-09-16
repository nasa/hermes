import { DataSource } from './datasource';

it.each([{ sources: undefined }, { sources: [] }, { sources: ['FSW-A'] }, { sources: ['FSW-A', 'FSW-B'] }])(
  'forwards channel source filters $sources', async ({ sources }) => {
  const datasource = Object.create(DataSource.prototype) as DataSource;
  const channels = [{ component: 'CDH', name: 'Temperature' }];
  datasource.getResource = jest.fn().mockResolvedValue(channels);
  expect(await datasource.getChannels(sources)).toEqual(channels);
  expect(datasource.getResource).toHaveBeenCalledWith('telemetry/channels', { sources: sources ?? [] });
});


it('forwards the bounded channel lookup range', async () => {
  const datasource = Object.create(DataSource.prototype) as DataSource;
  datasource.getResource = jest.fn().mockResolvedValue([]);
  const range = { from: '2026-09-14T18:00:00.000Z', to: '2026-09-14T19:00:00.000Z', timeField: 'ert' as const };
  await datasource.getChannels(['FSW-A'], range);
  expect(datasource.getResource).toHaveBeenCalledWith('telemetry/channels', { sources: ['FSW-A'], ...range });
});
