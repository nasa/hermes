import { DataSource } from './datasource';

it.each([{ sources: undefined }, { sources: [] }, { sources: ['FSW-A'] }, { sources: ['FSW-A', 'FSW-B'] }])(
  'forwards channel source filters $sources', async ({ sources }) => {
  const datasource = Object.create(DataSource.prototype) as DataSource;
  const channels = [{ component: 'CDH', name: 'Temperature' }];
  datasource.getResource = jest.fn().mockResolvedValue(channels);
  expect(await datasource.getChannels(sources)).toEqual(channels);
  expect(datasource.getResource).toHaveBeenCalledWith('telemetry/channels', { sources: sources ?? [] });
});
