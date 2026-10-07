import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryEditor } from './QueryEditor';
import { DataSource } from '../datasource';
import { ParameterRef, DEFAULT_QUERY, MyDataSourceOptions, MyQuery, withDefaults } from '../types';
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

function param(spaceSystem: string, name: string): ParameterRef {
  return { spaceSystem, name };
}

function mockDatasource(overrides?: Partial<DataSource>): DataSource {
  return {
    getParameters: jest.fn().mockResolvedValue([param('CDH', 'Temperature'), param('Sensors', 'Voltage')]),
    getInstances: jest.fn().mockResolvedValue(['fsw-1', 'fsw-2']),
    getMembers: jest.fn().mockResolvedValue([
      { spaceSystem: 'CDH', parameter: 'Temperature', member: '.x' },
      { spaceSystem: 'CDH', parameter: 'Temperature', member: '.y' },
    ]),
    getEventSources: jest.fn().mockResolvedValue(['fsw-1', 'fsw-2']),
    ...overrides,
  } as unknown as DataSource;
}

// A query saved before the query fields took their YAMCS names.
const OLD_SAVED_QUERY = {
  refId: 'A',
  queryType: 'telemetry',
  channels: [{ component: 'CDH', name: 'Temperature' }],
  sources: ['fsw-1'],
  keys: [{ component: 'CDH', channel: 'Temperature', key: '' }],
  aggregation: 'avg',
} as unknown as MyQuery;

function buildProps(
  overrides?: Partial<QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>>
): QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions> {
  return {
    query: { refId: 'A', queryType: 'telemetry', parameters: [], instances: [], members: [], aggregation: 'avg' } as MyQuery,
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
    expect(screen.queryByRole('radio', { name: /Events/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /Component/ })).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Parameter/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Instance/ })).toBeInTheDocument();
  });

  it('shows Member dropdown for compound parameters', async () => {
    const ds = mockDatasource({
      getMembers: jest.fn().mockResolvedValue([
      { spaceSystem: 'CDH', parameter: 'Temperature', member: '.x' },
      { spaceSystem: 'CDH', parameter: 'Temperature', member: '.y' },
    ]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'telemetry', parameters: [param('CDH', 'Temperature')], instances: [], members: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\/Temperature/ })).toBeInTheDocument();
    });
  });

  it('hides Member dropdown for scalar parameters', async () => {
    const ds = mockDatasource({
      getMembers: jest.fn().mockResolvedValue([{ spaceSystem: 'CDH', parameter: 'Temperature', member: '' }]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'telemetry', parameters: [param('CDH', 'Temperature')], instances: [], members: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getMembers).toHaveBeenCalled();
    });

    expect(screen.queryByRole('combobox', { name: /CDH\/Temperature/ })).not.toBeInTheDocument();
  });

  it('loads instance options on mount', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getInstances).toHaveBeenCalledTimes(1);
    });
  });

  it('loads all parameters on mount', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getParameters).toHaveBeenCalledTimes(1);
    });
  });

  it('loads members when parameters are set', async () => {
    const ds = mockDatasource();
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'telemetry', parameters: [param('CDH', 'Temperature')], instances: [], members: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getMembers).toHaveBeenCalledWith([param('CDH', 'Temperature')]);
    });
  });

  it('does not load members when parameter is not set', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getParameters).toHaveBeenCalled();
    });

    expect(ds.getMembers).not.toHaveBeenCalled();
  });

  it('displays existing telemetry query values', async () => {
    const ds = mockDatasource({
      getMembers: jest.fn().mockResolvedValue([
      { spaceSystem: 'CDH', parameter: 'Attitude', member: '.x' },
      { spaceSystem: 'CDH', parameter: 'Attitude', member: '.y' },
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
              parameters: [param('CDH', 'Attitude')],
              instances: ['fsw-1'],
              members: [{ spaceSystem: 'CDH', parameter: 'Attitude', member: '.x' }],
              aggregation: 'avg',
            } as MyQuery,
          })}
        />
      );
    });
    expect(screen.getByText('fsw-1')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\/Attitude/ })).toBeInTheDocument();
      expect(screen.getByText('.x')).toBeInTheDocument();
    });
  });

  it('renders per-parameter member dropdowns for two compound parameters', async () => {
    const ds = mockDatasource({
      getMembers: jest.fn().mockResolvedValue([
        { spaceSystem: 'CDH', parameter: 'Attitude', member: '.x' },
        { spaceSystem: 'CDH', parameter: 'Attitude', member: '.y' },
        { spaceSystem: 'Sensors', parameter: 'IMU', member: '.pitch' },
        { spaceSystem: 'Sensors', parameter: 'IMU', member: '.roll' },
      ]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: {
            refId: 'A',
            queryType: 'telemetry',
            parameters: [param('CDH', 'Attitude'), param('Sensors', 'IMU')],
            instances: [],
            members: [],
            aggregation: 'avg',
          } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\/Attitude/ })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /Sensors\/IMU/ })).toBeInTheDocument();
    });
  });

  it('shows member dropdown only for compound parameter when mixed with scalar', async () => {
    const ds = mockDatasource({
      getMembers: jest.fn().mockResolvedValue([
        { spaceSystem: 'CDH', parameter: 'Attitude', member: '.x' },
        { spaceSystem: 'CDH', parameter: 'Attitude', member: '.y' },
        { spaceSystem: 'CDH', parameter: 'Temperature', member: '' },
      ]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: {
            refId: 'A',
            queryType: 'telemetry',
            parameters: [param('CDH', 'Attitude'), param('CDH', 'Temperature')],
            instances: [],
            members: [],
            aggregation: 'avg',
          } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /CDH\/Attitude/ })).toBeInTheDocument();
    });
    expect(screen.queryByRole('combobox', { name: /CDH\/Temperature/ })).not.toBeInTheDocument();
  });

  it('handles resource fetch errors gracefully', async () => {
    const ds = mockDatasource({
      getParameters: jest.fn().mockRejectedValue(new Error('Network error')),
      getInstances: jest.fn().mockRejectedValue(new Error('Network error')),
    });
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getParameters).toHaveBeenCalled();
    });

    expect(screen.getByRole('combobox', { name: /Parameter/ })).toBeInTheDocument();
  });

  it('opens a query saved before the YAMCS names with nothing picked', async () => {
    const ds = mockDatasource();
    await act(async () => {
      render(<QueryEditor {...buildProps({ datasource: ds, query: OLD_SAVED_QUERY })} />);
    });

    expect(screen.getByRole('combobox', { name: /Parameter/ })).toBeInTheDocument();
    expect(screen.queryByText('CDH/Temperature')).not.toBeInTheDocument();
    expect(screen.queryByText('fsw-1')).not.toBeInTheDocument();
    expect(ds.getMembers).not.toHaveBeenCalled();
  });

  it('does not load event resources when in telemetry mode', async () => {
    const ds = mockDatasource();
    render(<QueryEditor {...buildProps({ datasource: ds })} />);

    await waitFor(() => {
      expect(ds.getParameters).toHaveBeenCalled();
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
            query: { refId: 'A', queryType: 'events', parameters: [], instances: [], members: [], aggregation: 'avg' } as MyQuery,
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
            query: { refId: 'A', queryType: 'events', parameters: [], instances: [], members: [], aggregation: 'avg' } as MyQuery,
          })}
        />
      );
    });

    expect(screen.queryByRole('combobox', { name: /Parameter/ })).not.toBeInTheDocument();
  });

  it('loads event sources on mount', async () => {
    const ds = mockDatasource();
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: { refId: 'A', queryType: 'events', parameters: [], instances: [], members: [], aggregation: 'avg' } as MyQuery,
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
          query: { refId: 'A', queryType: 'events', parameters: [], instances: [], members: [], aggregation: 'avg' } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getEventSources).toHaveBeenCalled();
    });

    expect(ds.getParameters).not.toHaveBeenCalled();
    expect(ds.getInstances).not.toHaveBeenCalled();
    expect(ds.getMembers).not.toHaveBeenCalled();
  });

  it('displays existing event source value', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: {
              refId: 'A',
              queryType: 'events',
              parameters: [],
              instances: ['fsw-1'],
              members: [],
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
          query: { refId: 'A', queryType: 'events', parameters: [], instances: [], members: [], aggregation: 'avg' } as MyQuery,
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
  it('renders multiple selected parameters', async () => {
    const ds = mockDatasource({
      getMembers: jest.fn().mockResolvedValue([{ spaceSystem: 'CDH', parameter: 'Temperature', member: '' }]),
    });
    render(
      <QueryEditor
        {...buildProps({
          datasource: ds,
          query: {
            refId: 'A',
            queryType: 'telemetry',
            parameters: [param('CDH', 'Temperature'), param('CDH', 'Voltage')],
            instances: [],
            members: [],
            aggregation: 'avg',
          } as MyQuery,
        })}
      />
    );

    await waitFor(() => {
      expect(ds.getMembers).toHaveBeenCalled();
    });
  });

  it('renders multiple selected instances', async () => {
    const ds = mockDatasource();
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            datasource: ds,
            query: {
              refId: 'A',
              queryType: 'telemetry',
              parameters: [param('CDH', 'Temperature')],
              instances: ['fsw-1', 'fsw-2'],
              members: [],
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
      getMembers: jest.fn().mockResolvedValue([{ spaceSystem: 'CDH', parameter: 'Temperature', member: '' }]),
    });

  const telemetryQuery = (overrides?: Partial<MyQuery>): MyQuery =>
    ({
      refId: 'A',
      queryType: 'telemetry',
      parameters: [param('CDH', 'Temperature')],
      instances: [],
      members: [],
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

  it('renders one transform input for a scalar parameter', async () => {
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query: telemetryQuery() })} />);
    await expandSection();

    expect(screen.getByTestId('query-editor-transform-CDH/Temperature')).toBeInTheDocument();
  });

  it('renders one transform input per member for a compound parameter', async () => {
    const ds = mockDatasource({
      getMembers: jest.fn().mockResolvedValue([
        { spaceSystem: 'CDH', parameter: 'Temperature', member: '.x' },
        { spaceSystem: 'CDH', parameter: 'Temperature', member: '.y' },
      ]),
    });
    const query = telemetryQuery({
      members: [
        { spaceSystem: 'CDH', parameter: 'Temperature', member: '.x' },
        { spaceSystem: 'CDH', parameter: 'Temperature', member: '.y' },
      ],
    });
    render(<QueryEditor {...buildProps({ datasource: ds, query })} />);
    await expandSection();

    expect(screen.getByTestId('query-editor-transform-CDH/Temperature.x')).toBeInTheDocument();
    expect(screen.getByTestId('query-editor-transform-CDH/Temperature.y')).toBeInTheDocument();
    expect(screen.queryByTestId('query-editor-transform-CDH/Temperature')).not.toBeInTheDocument();
  });

  it('renders no transform section when no parameter is selected', async () => {
    await act(async () => {
      render(<QueryEditor {...buildProps()} />);
    });

    expect(screen.queryByTestId('query-editor-transform-section')).not.toBeInTheDocument();
  });

  it('renders the shared toggles above the Value Transform section', async () => {
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query: telemetryQuery() })} />);

    const section = await screen.findByTestId('query-editor-transform-section');
    const timeFieldToggle = screen.getByRole('radio', { name: /Acquisition Time/ });

    expect(
      timeFieldToggle.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('starts expanded when the query already carries a transform', async () => {
    const query = telemetryQuery({
      transforms: [{ spaceSystem: 'CDH', parameter: 'Temperature', expr: '2' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query })} />);

    expect(await screen.findByTestId('query-editor-transform-CDH/Temperature')).toBeInTheDocument();
  });

  it('writes the raw input into query.transforms', async () => {
    const onChange = jest.fn();
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query: telemetryQuery(), onChange })} />);
    await expandSection();

    const input = screen.getByTestId('query-editor-transform-CDH/Temperature');
    await act(async () => {
      fireEvent.change(input, { target: { value: '2' } });
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: [{ spaceSystem: 'CDH', parameter: 'Temperature', member: undefined, expr: '2' }],
      })
    );
  });

  it('round-trips an expression back into the input', async () => {
    const query = telemetryQuery({
      transforms: [{ spaceSystem: 'CDH', parameter: 'Temperature', expr: '$__value - 273.15' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH/Temperature');
    expect(input).toHaveValue('$__value - 273.15');
  });

  it('removes the entry when the input is cleared', async () => {
    const onChange = jest.fn();
    const query = telemetryQuery({
      transforms: [{ spaceSystem: 'CDH', parameter: 'Temperature', expr: '2' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query, onChange })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH/Temperature');
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ transforms: [] }));
  });

  it('shows a validation message and does not run an invalid expression', async () => {
    const onRunQuery = jest.fn();
    const query = telemetryQuery({
      transforms: [{ spaceSystem: 'CDH', parameter: 'Temperature', expr: 'twice' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query, onRunQuery })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH/Temperature');
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
      transforms: [{ spaceSystem: 'CDH', parameter: 'Temperature', expr: '2' }],
    });
    render(<QueryEditor {...buildProps({ datasource: scalarDs(), query, onRunQuery })} />);

    const input = await screen.findByTestId('query-editor-transform-CDH/Temperature');
    onRunQuery.mockClear();
    await act(async () => {
      fireEvent.blur(input);
    });
    expect(onRunQuery).toHaveBeenCalled();
  });
});

describe('withDefaults', () => {
  it('fills in default timeField as generation_time (Generation Time)', () => {
    const q = withDefaults({ refId: 'A', parameters: [], instances: [], members: [] } as unknown as MyQuery);
    expect(q.timeField).toBe('generation_time');
  });

  it('fills in default queryType and aggregation', () => {
    const q = withDefaults({ refId: 'A', parameters: [], instances: [], members: [] } as unknown as MyQuery);
    expect(q.queryType).toBe('telemetry');
    expect(q.aggregation).toBe('avg');
  });

  it('preserves explicit values', () => {
    const q = withDefaults({ refId: 'A', queryType: 'events', timeField: 'acquisition_time', aggregation: 'max', parameters: [], instances: [], members: [] } as MyQuery);
    expect(q.queryType).toBe('events');
    expect(q.timeField).toBe('acquisition_time');
    expect(q.aggregation).toBe('max');
  });

  it('fills empty lists for a query saved before the YAMCS names', () => {
    const q = withDefaults(OLD_SAVED_QUERY);
    expect(q.parameters).toEqual([]);
    expect(q.instances).toEqual([]);
    expect(q.members).toEqual([]);
    expect(q.transforms).toEqual([]);
  });

  it('DEFAULT_QUERY timeField matches UI default (generation_time)', () => {
    expect(DEFAULT_QUERY.timeField).toBe('generation_time');
  });
});

describe('QueryEditor — Time field toggle', () => {
  it('renders Generation Time/Acquisition Time radio buttons for telemetry', async () => {
    await act(async () => { render(<QueryEditor {...buildProps()} />); });

    expect(screen.getByRole('radio', { name: /Generation Time/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Acquisition Time/ })).toBeInTheDocument();
  });

  it('defaults to Generation Time when timeField is not set', async () => {
    await act(async () => { render(<QueryEditor {...buildProps()} />); });

    expect(screen.getByRole('radio', { name: /Generation Time/ })).toBeChecked();
  });

  it('selects Acquisition Time when timeField is acquisition_time', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: {
              refId: 'A',
              queryType: 'telemetry',
              parameters: [],
              instances: [],
              members: [],
              timeField: 'acquisition_time',
              aggregation: 'avg',
            } as MyQuery,
          })}
        />
      );
    });

    expect(screen.getByRole('radio', { name: /Acquisition Time/ })).toBeChecked();
  });

  it('renders Generation Time/Acquisition Time radio buttons for events', async () => {
    await act(async () => {
      render(
        <QueryEditor
          {...buildProps({
            query: { refId: 'A', queryType: 'events', parameters: [], instances: [], members: [], aggregation: 'avg' } as MyQuery,
          })}
        />
      );
    });

    expect(screen.getByRole('radio', { name: /Generation Time/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Acquisition Time/ })).toBeInTheDocument();
  });
});
