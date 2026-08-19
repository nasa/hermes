import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryEditor } from './QueryEditor';
import { DataSource } from '../datasource';
import { ChannelRef, DEFAULT_QUERY, MyDataSourceOptions, MyQuery, withDefaults } from '../types';
import { QueryEditorProps } from '@grafana/data';

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getTemplateSrv: () => ({
    replace: (value: string) => value,
    getVariables: () => [],
    containsTemplate: () => false,
  }),
}));

beforeAll(() => {
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

function ch(component: string, name: string): ChannelRef {
  return { component, name };
}

function mockDatasource(overrides?: Partial<DataSource>): DataSource {
  return {
    getChannels: jest.fn().mockResolvedValue([ch('CDH', 'Temperature'), ch('Sensors', 'Voltage')]),
    getSources: jest.fn().mockResolvedValue(['fsw-1', 'fsw-2']),
    getKeys: jest.fn().mockResolvedValue([
      { component: 'CDH', channel: 'Temperature', key: 'value' },
      { component: 'CDH', channel: 'Temperature', key: 'value.x' },
      { component: 'CDH', channel: 'Temperature', key: 'value.y' },
    ]),
    getEventSources: jest.fn().mockResolvedValue(['fsw-1', 'fsw-2']),
    ...overrides,
  } as unknown as DataSource;
}

function buildProps(
  overrides?: Partial<QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>>
): QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions> {
  return {
    query: { refId: 'A', queryType: 'telemetry', channels: [], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
    onChange: jest.fn(),
    onRunQuery: jest.fn(),
    datasource: mockDatasource(),
    ...overrides,
  } as QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;
}

describe('QueryEditor — Telemetry', () => {
  it('renders query type toggle and telemetry dropdowns', async () => {
    await act(async () => { render(<QueryEditor {...buildProps()} />); });

    expect(screen.getByRole('radio', { name: /Telemetry/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Events/ })).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /Component/ })).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Channel/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Source/ })).toBeInTheDocument();
  });

  it('shows Key dropdown for compound channels', async () => {
    const ds = mockDatasource({
      getKeys: jest.fn().mockResolvedValue([
      { component: 'CDH', channel: 'Temperature', key: 'value' },
      { component: 'CDH', channel: 'Temperature', key: 'value.x' },
      { component: 'CDH', channel: 'Temperature', key: 'value.y' },
    ]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'telemetry', channels: [ch('CDH', 'Temperature')], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\.Temperature/ })).toBeInTheDocument();
    });
  });

  it('hides Key dropdown for scalar channels', async () => {
    const ds = mockDatasource({
      getKeys: jest.fn().mockResolvedValue([{ component: 'CDH', channel: 'Temperature', key: 'value' }]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'telemetry', channels: [ch('CDH', 'Temperature')], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getKeys).toHaveBeenCalled();
    });

    expect(screen.queryByRole('combobox', { name: /CDH\.Temperature/ })).not.toBeInTheDocument();
  });

  it('loads source options on mount', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getSources).toHaveBeenCalledTimes(1);
    });
  });

  it('loads all channels on mount', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getChannels).toHaveBeenCalledTimes(1);
    });
  });

  it('loads keys when channels are set', async () => {
    const ds = mockDatasource();
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'telemetry', channels: [ch('CDH', 'Temperature')], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getKeys).toHaveBeenCalledWith([ch('CDH', 'Temperature')]);
    });
  });

  it('does not load keys when channel is not set', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getChannels).toHaveBeenCalled();
    });

    expect(ds.getKeys).not.toHaveBeenCalled();
  });

  it('displays existing telemetry query values', async () => {
    const ds = mockDatasource({
      getKeys: jest.fn().mockResolvedValue([
      { component: 'CDH', channel: 'Attitude', key: 'value' },
      { component: 'CDH', channel: 'Attitude', key: 'value.x' },
      { component: 'CDH', channel: 'Attitude', key: 'value.y' },
    ]),
    });
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            datasource: ds,
            query: {
              refId: 'A',
              queryType: 'telemetry',
              channels: [ch('CDH', 'Attitude')],
              sources: ['fsw-1'],
              keys: [{ component: 'CDH', channel: 'Attitude', key: 'value.x' }],
              aggregation: 'avg',
            } as MyQuery,
          })}
        />
      );
    });
    expect(screen.getByText('fsw-1')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\.Attitude/ })).toBeInTheDocument();
      expect(screen.getByText('value.x')).toBeInTheDocument();
    });
  });

  it('renders per-channel key dropdowns for two compound channels', async () => {
    const ds = mockDatasource({
      getKeys: jest.fn().mockResolvedValue([
        { component: 'CDH', channel: 'Attitude', key: 'value' },
        { component: 'CDH', channel: 'Attitude', key: 'value.x' },
        { component: 'Sensors', channel: 'IMU', key: 'value' },
        { component: 'Sensors', channel: 'IMU', key: 'value.roll' },
      ]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: {
            refId: 'A',
            queryType: 'telemetry',
            channels: [ch('CDH', 'Attitude'), ch('Sensors', 'IMU')],
            sources: [],
            keys: [],
            aggregation: 'avg',
          } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\.Attitude/ })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /Sensors\.IMU/ })).toBeInTheDocument();
    });
  });

  it('shows key dropdown only for compound channel when mixed with scalar', async () => {
    const ds = mockDatasource({
      getKeys: jest.fn().mockResolvedValue([
        { component: 'CDH', channel: 'Attitude', key: 'value' },
        { component: 'CDH', channel: 'Attitude', key: 'value.x' },
        { component: 'CDH', channel: 'Temperature', key: 'value' },
      ]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: {
            refId: 'A',
            queryType: 'telemetry',
            channels: [ch('CDH', 'Attitude'), ch('CDH', 'Temperature')],
            sources: [],
            keys: [],
            aggregation: 'avg',
          } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\.Attitude/ })).toBeInTheDocument();
    });
    expect(screen.queryByRole('combobox', { name: /CDH\.Temperature/ })).not.toBeInTheDocument();
  });

  it('handles resource fetch errors gracefully', async () => {
    const ds = mockDatasource({
      getChannels: jest.fn().mockRejectedValue(new Error('Network error')),
      getSources: jest.fn().mockRejectedValue(new Error('Network error')),
    });
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getChannels).toHaveBeenCalled();
    });

    expect(screen.getByRole('combobox', { name: /Channel/ })).toBeInTheDocument();
  });

  it('does not load event resources when in telemetry mode', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getChannels).toHaveBeenCalled();
    });

    expect(ds.getEventSources).not.toHaveBeenCalled();
  });
});

describe('QueryEditor — Events', () => {
  it('renders only source dropdown when queryType is events', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: { refId: 'A', queryType: 'events', channels: [], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
          })}
        />
      );
    });

    expect(screen.getByRole('combobox', { name: /Source/ })).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /Event name/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /Severity/ })).not.toBeInTheDocument();
  });

  it('hides telemetry fields when queryType is events', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: { refId: 'A', queryType: 'events', channels: [], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
          })}
        />
      );
    });

    expect(screen.queryByRole('combobox', { name: /Channel/ })).not.toBeInTheDocument();
  });

  it('loads event sources on mount', async () => {
    const ds = mockDatasource();
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'events', channels: [], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getEventSources).toHaveBeenCalledTimes(1);
    });
  });

  it('does not load telemetry resources when in events mode', async () => {
    const ds = mockDatasource();
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'events', channels: [], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getEventSources).toHaveBeenCalled();
    });

    expect(ds.getChannels).not.toHaveBeenCalled();
    expect(ds.getSources).not.toHaveBeenCalled();
    expect(ds.getKeys).not.toHaveBeenCalled();
  });

  it('displays existing event source value', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: {
              refId: 'A',
              queryType: 'events',
              channels: [],
              sources: ['fsw-1'],
              keys: [],
              aggregation: 'avg',
            } as MyQuery,
          })}
        />
      );
    });

    expect(screen.getByText('fsw-1')).toBeInTheDocument();
  });

  it('handles event source fetch errors gracefully', async () => {
    const ds = mockDatasource({
      getEventSources: jest.fn().mockRejectedValue(new Error('Network error')),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'events', channels: [], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getEventSources).toHaveBeenCalled();
    });

    expect(screen.getByRole('combobox', { name: /Source/ })).toBeInTheDocument();
  });
});

describe('QueryEditor — Multi-select', () => {
  it('renders multiple selected channels', async () => {
    const ds = mockDatasource({
      getKeys: jest.fn().mockResolvedValue([{ component: 'CDH', channel: 'Temperature', key: 'value' }]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: {
            refId: 'A',
            queryType: 'telemetry',
            channels: [ch('CDH', 'Temperature'), ch('CDH', 'Voltage')],
            sources: [],
            keys: [],
            aggregation: 'avg',
          } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getKeys).toHaveBeenCalled();
    });
  });

  it('renders multiple selected sources', async () => {
    const ds = mockDatasource();
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            datasource: ds,
            query: {
              refId: 'A',
              queryType: 'telemetry',
              channels: [ch('CDH', 'Temperature')],
              sources: ['fsw-1', 'fsw-2'],
              keys: [],
              aggregation: 'avg',
            } as MyQuery,
          })}
        />
      );
    });

    // MultiCombobox in jsdom may only render visible pills
    expect(screen.getByText('fsw-1')).toBeInTheDocument();
  });
});

describe('QueryEditor — Value transforms', () => {
  const scalarDs = () =>
    mockDatasource({
      getKeys: jest.fn().mockResolvedValue([{ component: 'CDH', channel: 'Temperature', key: 'value' }]),
    });

  const telemetryQuery = (overrides?: Partial<MyQuery>): MyQuery =>
    ({
      refId: 'A',
      queryType: 'telemetry',
      channels: [ch('CDH', 'Temperature')],
      sources: [],
      keys: [],
      aggregation: 'avg',
      ...overrides,
    }) as MyQuery;

  // The section is collapsed until the query carries a transform, and
  // CollapsableSection unmounts its children while closed.
  async function expandSection() {
    const header = await screen.findByTestId('query-editor-transform-section');
    await act(async () => {
      fireEvent.click(header);
    });
  }

  it('renders one transform input for a scalar channel', async () => {
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query: telemetryQuery() })} />);
    await expandSection();

    expect(screen.getByTestId('query-editor-transform-CDH.Temperature')).toBeInTheDocument();
  });

  it('renders one transform input per key for a compound channel', async () => {
    const ds = mockDatasource({
      getKeys: jest.fn().mockResolvedValue([
        { component: 'CDH', channel: 'Temperature', key: 'value.x' },
        { component: 'CDH', channel: 'Temperature', key: 'value.y' },
      ]),
    });
    const query = telemetryQuery({
      keys: [
        { component: 'CDH', channel: 'Temperature', key: 'value.x' },
        { component: 'CDH', channel: 'Temperature', key: 'value.y' },
      ],
    });
    render(<QueryEditor {...buildProps({ datasource: ds, query })} />);
    await expandSection();

    expect(screen.getByTestId('query-editor-transform-CDH.Temperature.value.x')).toBeInTheDocument();
    expect(screen.getByTestId('query-editor-transform-CDH.Temperature.value.y')).toBeInTheDocument();
    expect(screen.queryByTestId('query-editor-transform-CDH.Temperature')).not.toBeInTheDocument();
  });

  it('renders no transform section when no channel is selected', async () => {
    await act(async () => {
      render(<QueryEditor {...buildProps()} />);
    });

    expect(screen.queryByTestId('query-editor-transform-section')).not.toBeInTheDocument();
  });

  it('renders the shared toggles above the Value Transform section', async () => {
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query: telemetryQuery() })} />);

    const section = await screen.findByTestId('query-editor-transform-section');
    const timeFieldToggle = screen.getByRole('radio', { name: /Receive Time/ });

    expect(
      timeFieldToggle.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('starts expanded when the query already carries a transform', async () => {
    const query = telemetryQuery({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query })} />);

    expect(await screen.findByTestId('query-editor-transform-CDH.Temperature')).toBeInTheDocument();
  });

  it('writes the raw input into query.transforms', async () => {
    const onChange = jest.fn();
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query: telemetryQuery(), onChange })} />);
    await expandSection();

    const input = screen.getByTestId('query-editor-transform-CDH.Temperature');
    await act(async () => {
      fireEvent.change(input, { target: { value: '2' } });
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: [{ component: 'CDH', channel: 'Temperature', targetKey: undefined, expr: '2' }],
      })
    );
  });

  it('round-trips an expression back into the input', async () => {
    const query = telemetryQuery({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$__value - 273.15' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH.Temperature');
    expect(input).toHaveValue('$__value - 273.15');
  });

  it('removes the entry when the input is cleared', async () => {
    const onChange = jest.fn();
    const query = telemetryQuery({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query, onChange })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH.Temperature');
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ transforms: [] }));
  });

  it('shows a validation message and does not run an invalid expression', async () => {
    const onRunQuery = jest.fn();
    const query = telemetryQuery({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: 'twice' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query, onRunQuery })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH.Temperature');
    expect(screen.getByText(/must reference \$__value/)).toBeInTheDocument();

    onRunQuery.mockClear();
    await act(async () => {
      fireEvent.blur(input);
    });
    expect(onRunQuery).not.toHaveBeenCalled();
  });

  it('runs the query on blur when the expression is valid', async () => {
    const onRunQuery = jest.fn();
    const query = telemetryQuery({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query, onRunQuery })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH.Temperature');
    onRunQuery.mockClear();
    await act(async () => {
      fireEvent.blur(input);
    });
    expect(onRunQuery).toHaveBeenCalled();
  });
});

describe('withDefaults', () => {
  it('fills in default timeField as ert (Receive Time)', () => {
    const q = withDefaults({ refId: 'A', channels: [], sources: [], keys: [] } as unknown as MyQuery);
    expect(q.timeField).toBe('ert');
  });

  it('fills in default queryType and aggregation', () => {
    const q = withDefaults({ refId: 'A', channels: [], sources: [], keys: [] } as unknown as MyQuery);
    expect(q.queryType).toBe('telemetry');
    expect(q.aggregation).toBe('avg');
  });

  it('preserves explicit values', () => {
    const q = withDefaults({ refId: 'A', queryType: 'events', timeField: 'time', aggregation: 'max', channels: [], sources: [], keys: [] } as MyQuery);
    expect(q.queryType).toBe('events');
    expect(q.timeField).toBe('time');
    expect(q.aggregation).toBe('max');
  });

  it('DEFAULT_QUERY timeField matches UI default (ert)', () => {
    expect(DEFAULT_QUERY.timeField).toBe('ert');
  });
});

describe('QueryEditor — Time field toggle', () => {
  it('renders Receive Time/On-board Time radio buttons for telemetry', async () => {
    await act(async () => { render(<QueryEditor {...buildProps()} />); });

    expect(screen.getByRole('radio', { name: /Receive Time/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /On-board Time/ })).toBeInTheDocument();
  });

  it('defaults to Receive Time when timeField is not set', async () => {
    await act(async () => { render(<QueryEditor {...buildProps()} />); });

    expect(screen.getByRole('radio', { name: /Receive Time/ })).toBeChecked();
  });

  it('selects Receive Time when timeField is ert', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: {
              refId: 'A',
              queryType: 'telemetry',
              channels: [],
              sources: [],
              keys: [],
              timeField: 'ert',
              aggregation: 'avg',
            } as MyQuery,
          })}
        />
      );
    });

    expect(screen.getByRole('radio', { name: /Receive Time/ })).toBeChecked();
  });

  it('renders Receive Time/On-board Time radio buttons for events', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: { refId: 'A', queryType: 'events', channels: [], sources: [], keys: [], aggregation: 'avg' } as MyQuery,
          })}
        />
      );
    });

    expect(screen.getByRole('radio', { name: /Receive Time/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /On-board Time/ })).toBeInTheDocument();
  });
});
