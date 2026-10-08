import React, { ReactNode, useEffect, useState } from 'react';
import { Combobox, ComboboxOption, InlineField, MultiCombobox } from '@grafana/ui';
import { getTemplateSrv } from '@grafana/runtime';
import { DataSource } from '../datasource';
import { Aggregation, MemberRef, MyQuery, ParameterQuery, ParameterRef } from '../types';
import { TransformFields } from './TransformFields';

interface TelemetryFieldsProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  datasource: DataSource;
  sharedOptions?: ReactNode;
}

const AGGREGATION_OPTIONS: Array<ComboboxOption<Aggregation>> = [
  { label: 'Average', value: 'avg' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Count', value: 'count' },
  { label: 'First', value: 'first' },
  { label: 'Last', value: 'last' },
  { label: 'Sum', value: 'sum' },
  { label: 'Derivative', value: 'deriv' },
  { label: 'Raw (none)', value: 'raw' },
  { label: 'Latest Value', value: 'latest' },
];

function toOptions(values: string[]): Array<ComboboxOption<string>> {
  return values.map((v) => ({ label: v, value: v }));
}

// Grafana returns saved members with their fields sorted alphabetically, so we
// stringify in a fixed order or a saved member won't match its picker option.
function memberRefToValue(m: MemberRef): string {
  return JSON.stringify({ spaceSystem: m.spaceSystem, parameter: m.parameter, member: m.member });
}

function valueToMemberRef(v: string): MemberRef {
  return JSON.parse(v) as MemberRef;
}

function toMemberOptions(entries: MemberRef[]): Array<ComboboxOption<string>> {
  return entries.map((e) => ({
    label: e.member,
    value: memberRefToValue(e),
  }));
}

function memberValues(members: MemberRef[]): string[] {
  return members.map(memberRefToValue);
}

function parameterId(spaceSystem: string, parameter: string): string {
  return `${spaceSystem}\0${parameter}`;
}

function groupMembersByParameter(entries: MemberRef[]): Record<string, MemberRef[]> {
  const grouped: Record<string, MemberRef[]> = {};
  for (const e of entries) {
    const id = parameterId(e.spaceSystem, e.parameter);
    if (!grouped[id]) {
      grouped[id] = [];
    }
    grouped[id].push(e);
  }
  return grouped;
}

// Grafana returns saved parameters with their fields sorted alphabetically, so we
// stringify in a fixed order or a saved parameter won't match its picker option.
export function parameterToKey(p: ParameterRef): string {
  return JSON.stringify({ spaceSystem: p.spaceSystem, name: p.name });
}

function toParameterOptions(entries: ParameterRef[]): Array<ComboboxOption<string>> {
  return entries.map((e) => ({
    label: `${e.spaceSystem}/${e.name}`,
    description: e.spaceSystem,
    value: parameterToKey(e),
  }));
}

function parameterLabel(p: ParameterQuery): string {
  if (p.raw !== undefined) {
    return p.raw;
  }
  // Avoid rendering a stray trailing slash when a parameter has no name.
  return p.name ? `${p.spaceSystem}/${p.name}` : p.spaceSystem;
}

function parameterValue(p: ParameterQuery): string {
  return p.raw !== undefined ? p.raw : parameterToKey(p);
}

function parameterValuesOrOptions(parameters: ParameterQuery[]): Array<ComboboxOption<string>> {
  return parameters.map(p => ({
    label: parameterLabel(p),
    value: parameterValue(p),
  }));
}

function referencedVariables(input: string): string[] {
  return (input.match(/\$\{?\w+\}?/g) ?? []).map((tok) => tok.replace(/[${}]/g, ''));
}

function isVariableReference(input: string): boolean {
  const refs = referencedVariables(input);
  if (refs.length === 0) {
    return false;
  }
  const defined = new Set(getTemplateSrv().getVariables().map((v) => v.name));
  return refs.every((name) => defined.has(name));
}

export function TelemetryFields({ query, onChange, onRunQuery, datasource, sharedOptions }: TelemetryFieldsProps) {
  const [parameterOptions, setParameterOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [instanceOptions, setInstanceOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [membersByParameter, setMembersByParameter] = useState<Record<string, MemberRef[]>>({});

  const [parameterLoading, setParameterLoading] = useState(false);
  const [instanceLoading, setInstanceLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);

  // --- Helpers ---

  const getParameterOptionsWithVariables = async (inputValue: string): Promise<Array<ComboboxOption<string>>> => {
    const options: Array<ComboboxOption<string>> = [];

    if (isVariableReference(inputValue)) {
      options.push({ label: inputValue, value: inputValue, description: 'Use template variable' });
    }

    // Autocomplete hints for the template variable currently being typed.
    if (inputValue.includes('$')) {
      const partialMatch = inputValue.match(/\$\w*$/);
      if (partialMatch) {
        const partial = partialMatch[0];
        const prefix = inputValue.slice(0, partialMatch.index);
        const variableNames = getTemplateSrv().getVariables().map((v) => `$${v.name}`);

        const hints = variableNames
          .filter((name) => name.toLowerCase().startsWith(partial.toLowerCase()))
          .map((name) => `${prefix}${name}`)
          .filter((suggestion) => suggestion !== inputValue)
          .map((suggestion) => ({ label: suggestion, value: suggestion, infoOption: true, icon: 'code-branch' as const }));
        options.push(...hints);
      }
      return options;
    }

    const matches = parameterOptions.filter(opt =>
      opt.label?.toLowerCase().includes(inputValue.toLowerCase())
    );
    options.push(...matches);
    return options;
  };

  // --- Handlers ---

  const onParameterChange = (options: Array<ComboboxOption<string>>) => {
    const parameters = options
      .map(({ value, label }): ParameterQuery | null => {
        const valueStr = typeof value === 'string' ? value : String(value ?? '');

        // Known-parameter options encode a { spaceSystem, name } object as JSON.
        if (valueStr.startsWith('{')) {
          try {
            const parsed = JSON.parse(valueStr) as ParameterRef;
            if (typeof parsed.spaceSystem === 'string' && typeof parsed.name === 'string') {
              return { spaceSystem: parsed.spaceSystem, name: parsed.name };
            }
          } catch {
            // Treat as raw text
          }
        }

        // Custom template variable reference
        const raw = valueStr || label || '';
        if (!isVariableReference(raw)) {
          return null;
        }

        return { raw };
      })
      .filter((p): p is ParameterQuery => p !== null);

    const stillExists = (spaceSystem: string, parameter: string) =>
      parameters.some((p) => p.raw === undefined && p.spaceSystem === spaceSystem && p.name === parameter);
    const members = (query.members ?? []).filter((m) => stillExists(m.spaceSystem, m.parameter));
    const transforms = (query.transforms ?? []).filter((t) => stillExists(t.spaceSystem, t.parameter));

    const updated: MyQuery = { ...query, parameters, members, transforms };
    onChange(updated);
    if (parameters.length) {
      onRunQuery();
    }
  };

  const onInstanceChange = (options: Array<ComboboxOption<string>>) => {
    const updated: MyQuery = { ...query, instances: options.map(({ value }) => value) };
    onChange(updated);
    if (updated.parameters && updated.parameters.length) {
      onRunQuery();
    }
  };

  const onMemberChange = (spaceSystem: string, parameter: string, options: Array<ComboboxOption<string>>) => {
    const id = parameterId(spaceSystem, parameter);
    const newMembers = options.map(({ value }) => valueToMemberRef(value));
    const otherMembers = (query.members ?? []).filter(
      (m) => parameterId(m.spaceSystem, m.parameter) !== id
    );

    const parameters = newMembers.length === 0
      ? (query.parameters ?? []).filter((p) => !(p.spaceSystem === spaceSystem && p.name === parameter))
      : query.parameters;

    const keptMembers = new Set(newMembers.map((m) => m.member));
    const transforms = (query.transforms ?? []).filter((t) => {
      if (t.spaceSystem !== spaceSystem || t.parameter !== parameter) {
        return true;
      }
      if (newMembers.length === 0) {
        return false;
      }
      return t.member === undefined || keptMembers.has(t.member);
    });

    const updated: MyQuery = { ...query, parameters, members: [...otherMembers, ...newMembers], transforms };
    onChange(updated);
    if (updated.parameters.length) {
      onRunQuery();
    }
  };

  const onAggregationChange = (option: ComboboxOption<Aggregation>) => {
    onChange({ ...query, aggregation: option.value });
    onRunQuery();
  };

  // --- Data loading ---

  useEffect(() => {
    const loadParameters = async () => {
      setParameterLoading(true);
      datasource
        .getParameters()
        .then((entries) => setParameterOptions(toParameterOptions(entries)))
        .catch(() => setParameterOptions([]))
        .finally(() => setParameterLoading(false));
    };
    loadParameters();
  }, [datasource]);

  useEffect(() => {
    const loadInstances = async () => {
      setInstanceLoading(true);
      datasource
        .getInstances()
        .then((values) => setInstanceOptions(toOptions(values)))
        .catch(() => setInstanceOptions([]))
        .finally(() => setInstanceLoading(false));
    };
    loadInstances();
  }, [datasource]);

  // Update members when vars change
  const templateSrv = getTemplateSrv();
  const resolvedParametersKey = JSON.stringify(
    (query.parameters ?? []).map((p) =>
      p.raw !== undefined
        ? templateSrv.replace(p.raw)
        : `${templateSrv.replace(p.spaceSystem)}\u0000${templateSrv.replace(p.name)}`
    )
  );

  useEffect(() => {
    if (!query.parameters || !query.parameters.length) {
      setTimeout(() => setMembersByParameter({}), 0);
      return;
    }
    const loadMembers = async () => {
      setMemberLoading(true);
      datasource
        .getMembers(query.parameters)
        .then((entries) => setMembersByParameter(groupMembersByParameter(entries)))
        .catch(() => setMembersByParameter({}))
        .finally(() => setMemberLoading(false));
    }
    loadMembers();
  }, [datasource, query.parameters, resolvedParametersKey]);

  useEffect(() => {
    const currentMembers = query.members ?? [];
    let added = false;
    const newMembers = [...currentMembers];
    for (const [id, members] of Object.entries(membersByParameter)) {
      if (members.length <= 1) {
        continue;
      }
      const hasSelection = currentMembers.some(
        (m) => parameterId(m.spaceSystem, m.parameter) === id
      );
      if (!hasSelection) {
        newMembers.push(...members);
        added = true;
      }
    }
    if (added) {
      onChange({ ...query, members: newMembers });
    }
  }, [membersByParameter, query, onChange]);

  return (
    <>
      <InlineField label="Parameter" labelWidth={16} tooltip="YAMCS parameter, shown as /space_system/name" grow shrink required>
        <MultiCombobox
          id="query-editor-parameter"
          data-testid="query-editor-parameter"
          options={getParameterOptionsWithVariables}
          value={parameterValuesOrOptions(query.parameters ?? [])}
          onChange={onParameterChange}
          loading={parameterLoading}
          placeholder="Select parameter"
          prefixIcon="channel-add"
          enableAllOption
        />
      </InlineField>
      <InlineField label="Aggregation" labelWidth={16} tooltip="Data aggregation method used when the data interval is smaller than the requested interval. The requested interval can be found in the query options at the top of this query." grow shrink>
        <Combobox
          options={AGGREGATION_OPTIONS}
          value={query.aggregation ?? 'avg'}
          onChange={onAggregationChange}
          isClearable={false}
          prefixIcon="calculator-alt"
        />
      </InlineField>
      <InlineField label="Instance" labelWidth={16} tooltip="YAMCS instance (optional)" grow shrink>
        <MultiCombobox
          id="query-editor-instance"
          data-testid="query-editor-instance"
          options={instanceOptions}
          value={query.instances}
          onChange={onInstanceChange}
          isClearable
          loading={instanceLoading}
          placeholder="All instances"
          prefixIcon="rocket"
        />
      </InlineField>
      {Object.entries(membersByParameter)
        .filter(([, members]) => members.length > 1)
        .map(([id, members]) => {
          const { spaceSystem, parameter } = members[0];
          const paramLabel = `${spaceSystem}/${parameter}`;
          const selectedForParameter = (query.members ?? []).filter(
            (m) => parameterId(m.spaceSystem, m.parameter) === id
          );
          return (
            <InlineField
              key={id}
              label={paramLabel}
              tooltip={`Members of ${paramLabel}`}
              grow
              shrink
            >
              <MultiCombobox
                id={`query-editor-member-${id}`}
                data-testid={`query-editor-member-${id}`}
                options={toMemberOptions(members)}
                value={memberValues(selectedForParameter)}
                onChange={(opts) => onMemberChange(spaceSystem, parameter, opts)}
                isClearable
                loading={memberLoading}
                placeholder="All members"
                prefixIcon="key-skeleton-alt"
              />
            </InlineField>
          );
        })}
      {sharedOptions}
      <TransformFields
        query={query}
        onChange={onChange}
        onRunQuery={onRunQuery}
        membersByParameter={membersByParameter}
      />
    </>
  );
}
