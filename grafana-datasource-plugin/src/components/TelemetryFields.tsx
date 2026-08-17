import React, { useEffect, useState } from 'react';
import { Combobox, ComboboxOption, InlineField, MultiCombobox } from '@grafana/ui';
import { getTemplateSrv } from '@grafana/runtime';
import { DataSource } from '../datasource';
import { Aggregation, ChannelQuery, ChannelRef, KeyRef, MyQuery } from '../types';

interface TelemetryFieldsProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  datasource: DataSource;
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
];

function toOptions(values: string[]): Array<ComboboxOption<string>> {
  return values.map((v) => ({ label: v, value: v }));
}

function keyRefToValue(k: KeyRef): string {
  return JSON.stringify(k);
}

function valueToKeyRef(v: string): KeyRef {
  return JSON.parse(v) as KeyRef;
}

function toKeyOptions(entries: KeyRef[]): Array<ComboboxOption<string>> {
  return entries.map((e) => ({
    label: e.key,
    value: keyRefToValue(e),
  }));
}

function keyValues(keys: KeyRef[]): string[] {
  return keys.map(keyRefToValue);
}

function channelKeyId(component: string, channel: string): string {
  return `${component}\0${channel}`;
}

function groupKeysByChannel(entries: KeyRef[]): Record<string, KeyRef[]> {
  const grouped: Record<string, KeyRef[]> = {};
  for (const e of entries) {
    const id = channelKeyId(e.component, e.channel);
    if (!grouped[id]) {
      grouped[id] = [];
    }
    grouped[id].push(e);
  }
  return grouped;
}

function channelToKey(ch: ChannelRef): string {
  return JSON.stringify(ch);
}

function toChannelOptions(entries: ChannelRef[]): Array<ComboboxOption<string>> {
  return entries.map((e) => ({
    label: `${e.component}.${e.name}`,
    description: e.component,
    value: channelToKey(e),
  }));
}

function channelLabel(ch: ChannelQuery): string {
  if (ch.raw !== undefined) {
    return ch.raw;
  }
  // Avoid rendering a stray trailing dot when a channel has no name.
  return ch.name ? `${ch.component}.${ch.name}` : ch.component;
}

function channelValue(ch: ChannelQuery): string {
  return ch.raw !== undefined ? ch.raw : channelToKey(ch);
}

function channelValuesOrOptions(channels: ChannelQuery[]): Array<ComboboxOption<string>> {
  return channels.map(ch => ({
    label: channelLabel(ch),
    value: channelValue(ch),
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

export function TelemetryFields({ query, onChange, onRunQuery, datasource }: TelemetryFieldsProps) {
  const [channelOptions, setChannelOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [sourceOptions, setSourceOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [keysByChannel, setKeysByChannel] = useState<Record<string, KeyRef[]>>({});

  const [channelLoading, setChannelLoading] = useState(false);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);

  // --- Helpers ---

  const getChannelOptionsWithVariables = async (inputValue: string): Promise<Array<ComboboxOption<string>>> => {
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

    const matches = channelOptions.filter(opt =>
      opt.label?.toLowerCase().includes(inputValue.toLowerCase())
    );
    options.push(...matches);
    return options;
  };

  // --- Handlers ---

  const onChannelChange = (options: Array<ComboboxOption<string>>) => {
    const channels = options
      .map(({ value, label }): ChannelQuery | null => {
        const valueStr = typeof value === 'string' ? value : String(value ?? '');

        // Known-channel options encode a { component, name } object as JSON.
        if (valueStr.startsWith('{')) {
          try {
            const parsed = JSON.parse(valueStr) as ChannelRef;
            if (typeof parsed.component === 'string' && typeof parsed.name === 'string') {
              return { component: parsed.component, name: parsed.name };
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
      .filter((ch): ch is ChannelQuery => ch !== null);

    const updated: MyQuery = { ...query, channels, keys: [], sources: [] };
    onChange(updated);
    if (channels.length) {
      onRunQuery();
    }
  };

  const onSourceChange = (options: Array<ComboboxOption<string>>) => {
    const updated: MyQuery = { ...query, sources: options.map(({ value }) => value) };
    onChange(updated);
    if (updated.channels && updated.channels.length) {
      onRunQuery();
    }
  };

  const onChannelKeyChange = (chComponent: string, chName: string, options: Array<ComboboxOption<string>>) => {
    const id = channelKeyId(chComponent, chName);
    const newKeys = options.map(({ value }) => valueToKeyRef(value));
    const otherKeys = (query.keys ?? []).filter(
      (k) => channelKeyId(k.component, k.channel) !== id
    );

    const channels = newKeys.length === 0
      ? (query.channels ?? []).filter((ch) => !(ch.component === chComponent && ch.name === chName))
      : query.channels;
    const updated: MyQuery = { ...query, channels, keys: [...otherKeys, ...newKeys] };
    onChange(updated);
    if (updated.channels.length) {
      onRunQuery();
    }
  };

  const onAggregationChange = (option: ComboboxOption<Aggregation>) => {
    onChange({ ...query, aggregation: option.value });
    onRunQuery();
  };

  // --- Data loading ---

  useEffect(() => {
    const loadChannels = async () => {
      setChannelLoading(true);
      datasource
        .getChannels()
        .then((entries) => setChannelOptions(toChannelOptions(entries)))
        .catch(() => setChannelOptions([]))
        .finally(() => setChannelLoading(false));
    };
    loadChannels();
  }, [datasource]);

  useEffect(() => {
    const loadSources = async () => {
      setSourceLoading(true);
      datasource
        .getSources()
        .then((values) => setSourceOptions(toOptions(values)))
        .catch(() => setSourceOptions([]))
        .finally(() => setSourceLoading(false));
    };
    loadSources();
  }, [datasource]);

  // Update keys when vars change
  const templateSrv = getTemplateSrv();
  const resolvedChannelsKey = JSON.stringify(
    (query.channels ?? []).map((ch) =>
      ch.raw !== undefined
        ? templateSrv.replace(ch.raw)
        : `${templateSrv.replace(ch.component)}\u0000${templateSrv.replace(ch.name)}`
    )
  );

  useEffect(() => {
    if (!query.channels || !query.channels.length) {
      setTimeout(() => setKeysByChannel({}), 0);
      return;
    }
    const loadKeys = async () => {
      setKeyLoading(true);
      datasource
        .getKeys(query.channels)
        .then((entries) => setKeysByChannel(groupKeysByChannel(entries)))
        .catch(() => setKeysByChannel({}))
        .finally(() => setKeyLoading(false));
    }
    loadKeys();
  }, [datasource, query.channels, resolvedChannelsKey]);

  useEffect(() => {
    const currentKeys = query.keys ?? [];
    let added = false;
    const newKeys = [...currentKeys];
    for (const [id, chKeys] of Object.entries(keysByChannel)) {
      if (chKeys.length <= 1) {
        continue;
      }
      const hasSelection = currentKeys.some(
        (k) => channelKeyId(k.component, k.channel) === id
      );
      if (!hasSelection) {
        newKeys.push(...chKeys);
        added = true;
      }
    }
    if (added) {
      onChange({ ...query, keys: newKeys });
    }
  }, [keysByChannel, query, onChange]);

  return (
    <>
      <InlineField label="Channel" labelWidth={16} tooltip="Telemetry channel name" grow shrink required>
        <MultiCombobox
          id="query-editor-channel"
          data-testid="query-editor-channel"
          options={getChannelOptionsWithVariables}
          value={channelValuesOrOptions(query.channels ?? [])}
          onChange={onChannelChange}
          loading={channelLoading}
          placeholder="Select channel"
          prefixIcon="channel-add"
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
      <InlineField label="Source" labelWidth={16} tooltip="FSW source identifier (optional)" grow shrink>
        <MultiCombobox
          id="query-editor-source"
          data-testid="query-editor-source"
          options={sourceOptions}
          value={query.sources}
          onChange={onSourceChange}
          isClearable
          loading={sourceLoading}
          placeholder="All sources"
          prefixIcon="rocket"
        />
      </InlineField>
      {Object.entries(keysByChannel)
        .filter(([, keys]) => keys.length > 1)
        .map(([id, keys]) => {
          const { component: chComp, channel: chName } = keys[0];
          const chLabel = `${chComp}.${chName}`;
          const selectedForChannel = (query.keys ?? []).filter(
            (k) => channelKeyId(k.component, k.channel) === id
          );
          return (
            <InlineField
              key={id}
              label={chLabel}
              tooltip={`Value field path for ${chLabel}`}
              grow
              shrink
            >
              <MultiCombobox
                id={`query-editor-key-${id}`}
                data-testid={`query-editor-key-${id}`}
                options={toKeyOptions(keys)}
                value={keyValues(selectedForChannel)}
                onChange={(opts) => onChannelKeyChange(chComp, chName, opts)}
                isClearable
                loading={keyLoading}
                placeholder="All keys"
                prefixIcon="key-skeleton-alt"
              />
            </InlineField>
          );
        })}
    </>
  );
}
