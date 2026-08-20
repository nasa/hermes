import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TelemetryFields } from './TelemetryFields';
import { DataSource } from '../datasource';
import { ChannelRef, KeyRef, MyQuery } from '../types';

let vars: Record<string, string> = {};
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getTemplateSrv: () => ({
    replace: (value: string) =>
      (value ?? '').replace(/\$\w+/g, (m: string) => (m.slice(1) in vars ? vars[m.slice(1)] : m)),
    getVariables: () => Object.keys(vars).map((name) => ({ name })),
    containsTemplate: () => false,
  }),
}));

beforeAll(() => {
  // @ts-ignore
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;

  HTMLCanvasElement.prototype.getContext = (() => ({
    measureText: (text: string) => ({ width: text.length * 8 }),
  })) as any;
});

const MOCK_CHANNELS: ChannelRef[] = [
  { component: 'CDH', name: 'Temperature' },
  { component: 'CDH', name: 'Voltage' },
  { component: 'PWR', name: 'Current' },
];

const MOCK_KEYS: KeyRef[] = [
  { component: 'CDH', channel: 'Temperature', key: 'value' },
  { component: 'CDH', channel: 'Voltage', key: 'value' },
  { component: 'PWR', channel: 'Current', key: 'value' },
];

const MOCK_SOURCES = ['FSW-A', 'FSW-B'];

function mockDatasource(): DataSource {
  return {
    getChannels: jest.fn().mockResolvedValue(MOCK_CHANNELS),
    getSources: jest.fn().mockResolvedValue(MOCK_SOURCES),
    getKeys: jest.fn().mockResolvedValue(MOCK_KEYS),
  } as unknown as DataSource;
}

function query(overrides?: Partial<MyQuery>): MyQuery {
  return {
    refId: 'A',
    queryType: 'telemetry',
    channels: [],
    sources: [],
    keys: [],
    aggregation: 'avg',
    ...overrides,
  } as MyQuery;
}

function renderFields(
  overrides?: Partial<MyQuery>,
  datasource = mockDatasource(),
  onRunQuery = jest.fn(),
  onChange = jest.fn()
) {
  render(
    <TelemetryFields
      query={query(overrides)}
      onChange={onChange}
      onRunQuery={onRunQuery}
      datasource={datasource}
    />
  );
  return { onRunQuery, onChange, datasource };
}

beforeEach(() => {
  vars = {};
});

describe('TelemetryFields — rendering', () => {
  it('renders the channel multicombobox', async () => {
    renderFields();
    await waitFor(() => {
      expect(screen.getByTestId('query-editor-channel')).toBeInTheDocument();
    });
  });

  it('renders the aggregation combobox', async () => {
    renderFields();
    await waitFor(() => {
      expect(screen.getByText('Aggregation')).toBeInTheDocument();
    });
  });

  it('renders the source multicombobox', async () => {
    renderFields();
    await waitFor(() => {
      expect(screen.getByTestId('query-editor-source')).toBeInTheDocument();
    });
  });
});

describe('TelemetryFields — data loading', () => {
  it('loads channel options from datasource on mount', async () => {
    const ds = mockDatasource();
    renderFields({}, ds);
    await waitFor(() => {
      expect(ds.getChannels).toHaveBeenCalled();
    });
  });

  it('loads source options from datasource on mount', async () => {
    const ds = mockDatasource();
    renderFields({}, ds);
    await waitFor(() => {
      expect(ds.getSources).toHaveBeenCalled();
    });
  });

  it('loads keys when channels are selected', async () => {
    const ds = mockDatasource();
    renderFields({ channels: [{ component: 'CDH', name: 'Temperature' }] }, ds);
    await waitFor(() => {
      expect(ds.getKeys).toHaveBeenCalledWith([{ component: 'CDH', name: 'Temperature' }]);
    });
  });

  it('does not load keys when no channels are selected', async () => {
    const ds = mockDatasource();
    renderFields({}, ds);
    await waitFor(() => {
      expect(ds.getChannels).toHaveBeenCalled();
    });
    expect(ds.getKeys).not.toHaveBeenCalled();
  });
});

describe('TelemetryFields — multi-key channels', () => {
  it('renders key selector for channels with multiple keys', async () => {
    const MULTI_KEY_KEYS: KeyRef[] = [
      { component: 'CDH', channel: 'Status', key: 'enabled' },
      { component: 'CDH', channel: 'Status', key: 'mode' },
      { component: 'CDH', channel: 'Status', key: 'health' },
    ];

    const ds = mockDatasource();
    (ds.getKeys as jest.Mock).mockResolvedValue(MULTI_KEY_KEYS);

    renderFields({ channels: [{ component: 'CDH', name: 'Status' }] }, ds);

    await waitFor(() => {
      expect(screen.getByTestId('query-editor-key-CDH\x00Status')).toBeInTheDocument();
    });
  });

  it('does not render key selector for channels with single keys', async () => {
    const SINGLE_KEY: KeyRef[] = [
      { component: 'CDH', channel: 'Temperature', key: 'value' },
    ];

    const ds = mockDatasource();
    (ds.getKeys as jest.Mock).mockResolvedValue(SINGLE_KEY);

    renderFields({ channels: [{ component: 'CDH', name: 'Temperature' }] }, ds);

    await waitFor(() => {
      expect(ds.getKeys).toHaveBeenCalled();
    });

    expect(screen.queryByTestId('query-editor-key-CDH\x00Temperature')).not.toBeInTheDocument();
  });

  it('auto-selects all keys when a multi-key channel is added', async () => {
    const MULTI_KEY_KEYS: KeyRef[] = [
      { component: 'CDH', channel: 'Status', key: 'enabled' },
      { component: 'CDH', channel: 'Status', key: 'mode' },
    ];

    const ds = mockDatasource();
    (ds.getKeys as jest.Mock).mockResolvedValue(MULTI_KEY_KEYS);
    const { onChange } = renderFields({ channels: [{ component: 'CDH', name: 'Status' }] }, ds);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          keys: expect.arrayContaining([
            expect.objectContaining({ key: 'enabled' }),
            expect.objectContaining({ key: 'mode' }),
          ]),
        })
      );
    });
  });
});

describe('TelemetryFields — displays existing values', () => {
  it('displays existing channel selections', async () => {
    const ds = mockDatasource();
    renderFields(
      { channels: [{ component: 'CDH', name: 'Temperature' }] },
      ds
    );

    await waitFor(() => {
      expect(screen.getByText('CDH.Temperature')).toBeInTheDocument();
    });
  });

  it('displays existing source selections', async () => {
    const ds = mockDatasource();
    renderFields({ sources: ['FSW-A'] }, ds);

    await waitFor(() => {
      expect(screen.getByText('FSW-A')).toBeInTheDocument();
    });
  });

  it('displays existing key selections for multi-key channels', async () => {
    const MULTI_KEY_KEYS: KeyRef[] = [
      { component: 'CDH', channel: 'Status', key: 'enabled' },
      { component: 'CDH', channel: 'Status', key: 'mode' },
    ];

    const ds = mockDatasource();
    (ds.getKeys as jest.Mock).mockResolvedValue(MULTI_KEY_KEYS);

    renderFields(
      {
        channels: [{ component: 'CDH', name: 'Status' }],
        keys: [{ component: 'CDH', channel: 'Status', key: 'enabled' }],
      },
      ds
    );

    await waitFor(() => {
      expect(screen.getByText('enabled')).toBeInTheDocument();
    });
  });
});
