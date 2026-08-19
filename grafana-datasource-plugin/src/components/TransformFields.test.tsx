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
