import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { MultiCombobox } from '@grafana/ui';
import { TelemetryFields } from './TelemetryFields';
import { DataSource } from '../datasource';
import { ChannelRef, MyQuery } from '../types';

let sourceVariable = 'FSW-A';
jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: () => ({
    replace: (value: string) => value.replace('$source', sourceVariable),
    getVariables: () => [],
  }),
}));
jest.mock('@grafana/ui', () => ({
  InlineField: ({ children }: { children: React.ReactNode }) => children,
  Combobox: () => null,
  MultiCombobox: jest.fn(() => null),
}));
jest.mock('./TransformFields', () => ({ TransformFields: () => null }));

function channelProps() {
  const calls = (MultiCombobox as unknown as jest.Mock).mock.calls;
  return [...calls].reverse().find(([props]) => props['data-testid'] === 'query-editor-channel')![0];
}

function deferred() {
  let resolve!: (channels: ChannelRef[]) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<ChannelRef[]>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

function setup(sources: string[], getChannels = jest.fn().mockResolvedValue([])) {
  const datasource = {
    getChannels,
    getSources: jest.fn().mockResolvedValue([]),
    getKeys: jest.fn().mockResolvedValue([]),
  } as unknown as DataSource;
  const query: MyQuery = {
    refId: 'A', queryType: 'telemetry', aggregation: 'avg', sources,
    channels: [{ component: 'CDH', name: 'Temperature' }], keys: [],
  };
  const onChange = jest.fn();
  const onRunQuery = jest.fn();
  const view = (nextSources: string[]) => (
    <TelemetryFields query={{ ...query, sources: nextSources }} datasource={datasource}
      onChange={onChange} onRunQuery={onRunQuery} />
  );
  const rendered = render(view(sources));
  return { getChannels, onChange, ...rendered, setSources: (next: string[]) => rendered.rerender(view(next)) };
}

beforeEach(() => {
  jest.clearAllMocks();
  sourceVariable = 'FSW-A';
});

it('reloads channels for selected sources and restores all channels when cleared', async () => {
  const { getChannels, setSources, onChange } = setup(['FSW-A']);
  await waitFor(() => expect(getChannels).toHaveBeenLastCalledWith(['FSW-A']));
  setSources(['FSW-A', 'FSW-B']);
  await waitFor(() => expect(getChannels).toHaveBeenLastCalledWith(['FSW-A', 'FSW-B']));
  setSources([]);
  await waitFor(() => expect(getChannels).toHaveBeenLastCalledWith([]));
  expect(onChange).not.toHaveBeenCalled();
});

it('does not reload for a new array containing the same sources', async () => {
  const { getChannels, setSources } = setup(['FSW-A']);
  await waitFor(() => expect(channelProps().loading).toBe(false));
  setSources(['FSW-A']);
  expect(getChannels).toHaveBeenCalledTimes(1);
});

it('reloads when a source template variable changes', async () => {
  const { getChannels, setSources } = setup(['$source']);
  await waitFor(() => expect(getChannels).toHaveBeenLastCalledWith(['FSW-A']));
  sourceVariable = 'FSW-B';
  setSources(['$source']);
  await waitFor(() => expect(getChannels).toHaveBeenLastCalledWith(['FSW-B']));
});

it.each(['resolve', 'reject'] as const)('ignores an obsolete request that later %ss', async (settle) => {
  const old = deferred();
  const current = deferred();
  const getChannels = jest.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
  const { setSources } = setup(['FSW-A'], getChannels);
  setSources(['FSW-B']);
  const channels = [{ component: 'PWR', name: 'Current' }];
  await act(async () => { current.resolve(channels); });
  await act(async () => {
    if (settle === 'resolve') {
      old.resolve([{ component: 'CDH', name: 'Temperature' }]);
    } else {
      old.reject(new Error('obsolete request'));
    }
  });
  expect(await channelProps().options('')).toEqual([
    expect.objectContaining({ label: 'PWR.Current', value: JSON.stringify(channels[0]) }),
  ]);
  expect(channelProps().loading).toBe(false);
});

it('keeps the loading state while a newer request is pending', async () => {
  const old = deferred();
  const current = deferred();
  const getChannels = jest.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
  const { setSources } = setup(['FSW-A'], getChannels);
  setSources(['FSW-B']);
  await act(async () => { old.resolve([]); });
  expect(channelProps().loading).toBe(true);
  await act(async () => { current.resolve([]); });
  expect(channelProps().loading).toBe(false);
});

it('clears stale options and finishes loading when the current request fails', async () => {
  const current = deferred();
  const getChannels = jest.fn()
    .mockResolvedValueOnce([{ component: 'CDH', name: 'Temperature' }])
    .mockReturnValueOnce(current.promise);
  const { setSources } = setup(['FSW-A'], getChannels);
  await waitFor(() => expect(channelProps().loading).toBe(false));
  setSources(['FSW-B']);
  expect(await channelProps().options('')).toEqual([]);
  await act(async () => { current.reject(new Error('request failed')); });
  expect(await channelProps().options('')).toEqual([]);
  expect(channelProps().loading).toBe(false);
});
