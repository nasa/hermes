import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { parameterToKey, TelemetryFields } from './TelemetryFields';
import { DataSource } from '../datasource';
import { MemberRef, MyQuery, ParameterRef } from '../types';

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

const MOCK_PARAMETERS: ParameterRef[] = [
  { spaceSystem: 'CDH', name: 'Temperature' },
  { spaceSystem: 'CDH', name: 'Voltage' },
  { spaceSystem: 'PWR', name: 'Current' },
];

const MOCK_MEMBERS: MemberRef[] = [
  { spaceSystem: 'CDH', parameter: 'Temperature', member: '' },
  { spaceSystem: 'CDH', parameter: 'Voltage', member: '' },
  { spaceSystem: 'PWR', parameter: 'Current', member: '' },
];

const MOCK_INSTANCES = ['FSW-A', 'FSW-B'];

function mockDatasource(): DataSource {
  return {
    getParameters: jest.fn().mockResolvedValue(MOCK_PARAMETERS),
    getInstances: jest.fn().mockResolvedValue(MOCK_INSTANCES),
    getMembers: jest.fn().mockResolvedValue(MOCK_MEMBERS),
  } as unknown as DataSource;
}

function query(overrides?: Partial<MyQuery>): MyQuery {
  return {
    refId: 'A',
    queryType: 'telemetry',
    parameters: [],
    instances: [],
    members: [],
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
  it('renders the parameter multicombobox', async () => {
    renderFields();
    await waitFor(() => {
      expect(screen.getByTestId('query-editor-parameter')).toBeInTheDocument();
    });
  });

  it('renders the aggregation combobox', async () => {
    renderFields();
    await waitFor(() => {
      expect(screen.getByText('Aggregation')).toBeInTheDocument();
    });
  });

  it('renders the instance multicombobox', async () => {
    renderFields();
    await waitFor(() => {
      expect(screen.getByTestId('query-editor-instance')).toBeInTheDocument();
    });
  });
});

describe('TelemetryFields — data loading', () => {
  it('loads parameter options from datasource on mount', async () => {
    const ds = mockDatasource();
    renderFields({}, ds);
    await waitFor(() => {
      expect(ds.getParameters).toHaveBeenCalled();
    });
  });

  it('loads instance options from datasource on mount', async () => {
    const ds = mockDatasource();
    renderFields({}, ds);
    await waitFor(() => {
      expect(ds.getInstances).toHaveBeenCalled();
    });
  });

  it('loads members when parameters are selected', async () => {
    const ds = mockDatasource();
    renderFields({ parameters: [{ spaceSystem: 'CDH', name: 'Temperature' }] }, ds);
    await waitFor(() => {
      expect(ds.getMembers).toHaveBeenCalledWith([{ spaceSystem: 'CDH', name: 'Temperature' }]);
    });
  });

  it('does not load members when no parameters are selected', async () => {
    const ds = mockDatasource();
    renderFields({}, ds);
    await waitFor(() => {
      expect(ds.getParameters).toHaveBeenCalled();
    });
    expect(ds.getMembers).not.toHaveBeenCalled();
  });
});

describe('TelemetryFields — multi-member parameters', () => {
  it('renders member selector for parameters with multiple members', async () => {
    const MULTI_MEMBERS: MemberRef[] = [
      { spaceSystem: 'CDH', parameter: 'Status', member: 'enabled' },
      { spaceSystem: 'CDH', parameter: 'Status', member: 'mode' },
      { spaceSystem: 'CDH', parameter: 'Status', member: 'health' },
    ];

    const ds = mockDatasource();
    (ds.getMembers as jest.Mock).mockResolvedValue(MULTI_MEMBERS);

    renderFields({ parameters: [{ spaceSystem: 'CDH', name: 'Status' }] }, ds);

    await waitFor(() => {
      expect(screen.getByTestId('query-editor-member-CDH\x00Status')).toBeInTheDocument();
    });
  });

  it('does not render member selector for parameters with a single member', async () => {
    const SINGLE_MEMBER: MemberRef[] = [
      { spaceSystem: 'CDH', parameter: 'Temperature', member: '' },
    ];

    const ds = mockDatasource();
    (ds.getMembers as jest.Mock).mockResolvedValue(SINGLE_MEMBER);

    renderFields({ parameters: [{ spaceSystem: 'CDH', name: 'Temperature' }] }, ds);

    await waitFor(() => {
      expect(ds.getMembers).toHaveBeenCalled();
    });

    expect(screen.queryByTestId('query-editor-member-CDH\x00Temperature')).not.toBeInTheDocument();
  });

  it('auto-selects all members when a multi-member parameter is added', async () => {
    const MULTI_MEMBERS: MemberRef[] = [
      { spaceSystem: 'CDH', parameter: 'Status', member: 'enabled' },
      { spaceSystem: 'CDH', parameter: 'Status', member: 'mode' },
    ];

    const ds = mockDatasource();
    (ds.getMembers as jest.Mock).mockResolvedValue(MULTI_MEMBERS);
    const { onChange } = renderFields({ parameters: [{ spaceSystem: 'CDH', name: 'Status' }] }, ds);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          members: expect.arrayContaining([
            expect.objectContaining({ member: 'enabled' }),
            expect.objectContaining({ member: 'mode' }),
          ]),
        })
      );
    });
  });
});

describe('TelemetryFields — displays existing values', () => {
  it('displays existing parameter selections', async () => {
    const ds = mockDatasource();
    renderFields(
      { parameters: [{ spaceSystem: 'CDH', name: 'Temperature' }] },
      ds
    );

    await waitFor(() => {
      expect(screen.getByText('CDH/Temperature')).toBeInTheDocument();
    });
  });

  it('displays existing instance selections', async () => {
    const ds = mockDatasource();
    renderFields({ instances: ['FSW-A'] }, ds);

    await waitFor(() => {
      expect(screen.getByText('FSW-A')).toBeInTheDocument();
    });
  });

  it('displays existing member selections for multi-member parameters', async () => {
    const MULTI_MEMBERS: MemberRef[] = [
      { spaceSystem: 'CDH', parameter: 'Status', member: 'enabled' },
      { spaceSystem: 'CDH', parameter: 'Status', member: 'mode' },
    ];

    const ds = mockDatasource();
    (ds.getMembers as jest.Mock).mockResolvedValue(MULTI_MEMBERS);

    renderFields(
      {
        parameters: [{ spaceSystem: 'CDH', name: 'Status' }],
        members: [{ spaceSystem: 'CDH', parameter: 'Status', member: 'enabled' }],
      },
      ds
    );

    await waitFor(() => {
      expect(screen.getByText('enabled')).toBeInTheDocument();
    });
  });

  it('gives a saved parameter the same key whatever order its fields come back in', () => {
    // Grafana saves the parameter with its fields sorted, and the picker marks an option
    // as picked by comparing these keys, so a mismatch would let it be picked twice.
    expect(parameterToKey({ name: 'Voltage', spaceSystem: 'CDH' })).toBe(
      parameterToKey({ spaceSystem: 'CDH', name: 'Voltage' })
    );
  });

  it('displays a saved member whose fields come back in alphabetical order', async () => {
    const MULTI_MEMBERS: MemberRef[] = [
      { spaceSystem: 'CDH', parameter: 'Status', member: 'enabled' },
      { spaceSystem: 'CDH', parameter: 'Status', member: 'mode' },
    ];

    const ds = mockDatasource();
    (ds.getMembers as jest.Mock).mockResolvedValue(MULTI_MEMBERS);

    renderFields(
      {
        parameters: [{ spaceSystem: 'CDH', name: 'Status' }],
        members: [{ member: 'enabled', parameter: 'Status', spaceSystem: 'CDH' }],
      },
      ds
    );

    await waitFor(() => {
      expect(screen.getByText('enabled')).toBeInTheDocument();
    });
  });
});
