import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { MultiCombobox } from '@grafana/ui';
import { TelemetryFields } from './TelemetryFields';
import { DataSource } from '../datasource';
import { ChannelRef, MyQuery } from '../types';

jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: () => ({ replace: (value: string) => value, getVariables: () => [] }),
}));
jest.mock('@grafana/ui', () => ({
  InlineField: ({ children }: { children: React.ReactNode }) => children,
  Combobox: () => null,
  MultiCombobox: jest.fn(() => null),
}));
jest.mock('./TransformFields', () => ({ TransformFields: () => null }));

const channels: ChannelRef[] = [
  { component: 'CDH', name: 'Temperature', source: 'FSW-A' },
  { component: 'CDH', name: 'Temperature', source: 'FSW-B' },
];
function channelProps() {
  return [...(MultiCombobox as unknown as jest.Mock).mock.calls].reverse()
    .find(([props]) => props['data-testid'] === 'query-editor-channel')![0];
}
async function setup(selected: ChannelRef[] = []) {
  const datasource = {
    getChannels: jest.fn().mockResolvedValue(channels),
    getSources: jest.fn().mockResolvedValue(['FSW-A', 'FSW-B']),
    getKeys: jest.fn().mockResolvedValue([]),
  } as unknown as DataSource;
  const query: MyQuery = {
    refId: 'A', queryType: 'telemetry', aggregation: 'avg', sources: [],
    channels: selected, keys: [],
  };
  const onChange = jest.fn();
  render(<TelemetryFields query={query} datasource={datasource} onChange={onChange} onRunQuery={jest.fn()} />);
  await waitFor(() => expect(channelProps().loading).toBe(false));
  return onChange;
}

beforeEach(() => jest.clearAllMocks());

it('shows distinct options and retains only the selected source', async () => {
  const onChange = await setup();
  const options = await channelProps().options('');
  expect(options.map(({ label }: { label: string }) => label))
    .toEqual(['CDH.Temperature [FSW-A]', 'CDH.Temperature [FSW-B]']);
  expect(options[0].value).not.toBe(options[1].value);
  act(() => channelProps().onChange([options[1]]));
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ channels: [channels[1]], sources: [] }));
});

it('uses a stable option identity for saved channels with a different property order', async () => {
  await setup([{ source: 'FSW-B', name: 'Temperature', component: 'CDH' }]);
  const options = await channelProps().options('');
  expect(channelProps().value).toEqual([{ label: 'CDH.Temperature [FSW-B]', value: options[1].value }]);
});

it('preserves source-agnostic legacy selections', async () => {
  const legacy = { component: 'CDH', name: 'Temperature' };
  const onChange = await setup([legacy]);
  expect(channelProps().value).toEqual([{ label: 'CDH.Temperature', value: JSON.stringify(legacy) }]);
  act(() => channelProps().onChange(channelProps().value));
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ channels: [legacy] }));
});

it('preserves an empty source identifier and rejects non-string sources', async () => {
  const onChange = await setup();
  const empty = { ...channels[0], source: '' };
  act(() => channelProps().onChange([{ value: JSON.stringify(empty) }]));
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ channels: [empty] }));
  act(() => channelProps().onChange([{ value: JSON.stringify({ ...channels[0], source: 123 }) }]));
  expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ channels: [] }));
});
