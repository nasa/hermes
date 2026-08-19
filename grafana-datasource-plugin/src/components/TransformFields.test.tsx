import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TransformFields } from './TransformFields';
import { KeyRef, MyQuery } from '../types';

// Controllable template-variable substitution: replace $name with vars[name]
// when defined, otherwise leave the text in place (mirrors templateSrv.replace).
let vars: Record<string, string> = {};
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getTemplateSrv: () => ({
    replace: (value: string) =>
      (value ?? '').replace(/\$\w+/g, (m: string) => (m.slice(1) in vars ? vars[m.slice(1)] : m)),
    getVariables: () => [],
    containsTemplate: () => false,
  }),
}));

const SCALAR_KEYS: Record<string, KeyRef[]> = {
  'CDH.Temperature': [{ component: 'CDH', channel: 'Temperature', key: 'value' }],
};

function query(overrides?: Partial<MyQuery>): MyQuery {
  return {
    refId: 'A',
    queryType: 'telemetry',
    channels: [{ component: 'CDH', name: 'Temperature' }],
    sources: [],
    keys: [],
    aggregation: 'avg',
    ...overrides,
  } as MyQuery;
}

function renderFields(overrides?: Partial<MyQuery>, onRunQuery = jest.fn(), onChange = jest.fn()) {
  render(
    <TransformFields
      query={query(overrides)}
      onChange={onChange}
      onRunQuery={onRunQuery}
      keysByChannel={SCALAR_KEYS}
    />
  );
  return { onRunQuery, onChange };
}

beforeEach(() => {
  vars = {};
});

describe('TransformFields — template variable shorthand', () => {
  it('treats a variable that resolves to a bare number as a valid shorthand', () => {
    vars = { num: '8' };
    renderFields({ transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$num' }] });

    const input = screen.getByTestId('query-editor-transform-CDH.Temperature');
    // The raw variable reference is preserved in the field...
    expect(input).toHaveValue('$num');
    // ...but it is not flagged as invalid (validation runs on the expansion).
    expect(screen.queryByText(/must reference \$__value/)).not.toBeInTheDocument();
    // ...and the resolved-expression hint reflects the expansion.
    const hint = screen.getByTestId('query-editor-transform-preview-CDH.Temperature');
    expect(hint).toHaveAttribute('title', '= $__value * 8');
  });

  it('shows the resolved-expression hint when a template variable is used in a full expression', () => {
    vars = { gain: '2' };
    renderFields({ transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$__value * $gain' }] });

    const hint = screen.getByTestId('query-editor-transform-preview-CDH.Temperature');
    expect(hint).toHaveAttribute('title', '= $__value * 2');
  });

  it('shows no resolved-expression hint when the expression has no variables or shorthand', () => {
    renderFields({ transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$__value * 2' }] });

    expect(screen.queryByTestId('query-editor-transform-preview-CDH.Temperature')).not.toBeInTheDocument();
  });

  it('runs the query on blur when a variable resolves to a bare number', () => {
    vars = { num: '8' };
    const { onRunQuery } = renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$num' }],
    });

    const input = screen.getByTestId('query-editor-transform-CDH.Temperature');
    onRunQuery.mockClear();
    act(() => {
      fireEvent.blur(input);
    });
    expect(onRunQuery).toHaveBeenCalled();
  });

  it('still flags a variable that resolves to a non-numeric, tokenless string', () => {
    vars = { bad: 'twice' };
    const { onRunQuery } = renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$bad' }],
    });

    const input = screen.getByTestId('query-editor-transform-CDH.Temperature');
    expect(screen.getByText(/must reference \$__value/)).toBeInTheDocument();

    onRunQuery.mockClear();
    act(() => {
      fireEvent.blur(input);
    });
    expect(onRunQuery).not.toHaveBeenCalled();
  });

  it('stores the raw variable reference, not its expansion', () => {
    vars = { num: '8' };
    const { onChange } = renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$num' }],
    });

    const input = screen.getByTestId('query-editor-transform-CDH.Temperature');
    act(() => {
      fireEvent.change(input, { target: { value: '$gain' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: [{ component: 'CDH', channel: 'Temperature', targetKey: undefined, expr: '$gain' }],
      })
    );
  });
});

describe('TransformFields — display name override', () => {
  // On a fresh query (no transforms) the section is collapsed; expand it so the
  // per-row inputs mount, mirroring how a user reaches a name-only override.
  const openSection = () => {
    act(() => {
      fireEvent.click(screen.getByTestId('query-editor-transform-section'));
    });
  };

  it('shows the row label as the alias placeholder', () => {
    renderFields();
    openSection();
    const alias = screen.getByTestId('query-editor-alias-CDH.Temperature');
    expect(alias).toHaveAttribute('placeholder', 'CDH.Temperature');
    expect(alias).toHaveValue('');
  });

  it('renders an existing name override in the alias field', () => {
    renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: 'Reactor Temp' }],
    });
    expect(screen.getByTestId('query-editor-alias-CDH.Temperature')).toHaveValue('Reactor Temp');
  });

  it('stores a name-only override (empty expr) on change', () => {
    const { onChange } = renderFields();
    openSection();
    const alias = screen.getByTestId('query-editor-alias-CDH.Temperature');
    act(() => {
      fireEvent.change(alias, { target: { value: 'Reactor Temp' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: [
          { component: 'CDH', channel: 'Temperature', targetKey: undefined, expr: '', name: 'Reactor Temp' },
        ],
      })
    );
  });

  it('preserves an existing expression when a name is added', () => {
    const { onChange } = renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '$__value * 2' }],
    });
    const alias = screen.getByTestId('query-editor-alias-CDH.Temperature');
    act(() => {
      fireEvent.change(alias, { target: { value: 'Reactor Temp' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: [
          { component: 'CDH', channel: 'Temperature', targetKey: undefined, expr: '$__value * 2', name: 'Reactor Temp' },
        ],
      })
    );
  });

  it('preserves an existing name when the expression is edited', () => {
    const { onChange } = renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: 'Reactor Temp' }],
    });
    const expr = screen.getByTestId('query-editor-transform-CDH.Temperature');
    act(() => {
      fireEvent.change(expr, { target: { value: '2' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: [
          { component: 'CDH', channel: 'Temperature', targetKey: undefined, expr: '2', name: 'Reactor Temp' },
        ],
      })
    );
  });

  it('drops the row when both the expression and name are cleared', () => {
    const { onChange } = renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: 'Reactor Temp' }],
    });
    const alias = screen.getByTestId('query-editor-alias-CDH.Temperature');
    act(() => {
      fireEvent.change(alias, { target: { value: '' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ transforms: [] })
    );
  });

  it('keeps the row (drops only the name) when a name is cleared but an expression remains', () => {
    const { onChange } = renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '2', name: 'Reactor Temp' }],
    });
    const alias = screen.getByTestId('query-editor-alias-CDH.Temperature');
    act(() => {
      fireEvent.change(alias, { target: { value: '' } });
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: [{ component: 'CDH', channel: 'Temperature', targetKey: undefined, expr: '2' }],
      })
    );
  });

  it('shows the expanded-name hint when the alias uses a template variable', () => {
    vars = { label: 'Reactor' };
    renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: '$label Temp' }],
    });
    const hint = screen.getByTestId('query-editor-alias-preview-CDH.Temperature');
    expect(hint).toHaveAttribute('title', '= Reactor Temp');
  });

  it('shows no expanded-name hint for a literal alias', () => {
    renderFields({
      transforms: [{ component: 'CDH', channel: 'Temperature', expr: '', name: 'Reactor Temp' }],
    });
    expect(screen.queryByTestId('query-editor-alias-preview-CDH.Temperature')).not.toBeInTheDocument();
  });
});
