import React, { useEffect, useState } from 'react';
import { CollapsableSection, Combobox, ComboboxOption, DateTimePicker, InlineField, MultiCombobox, RadioButtonGroup } from '@grafana/ui';
import { dateTime, DateTime, QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { Aggregation, ChannelRef, KeyRef, MyDataSourceOptions, MyQuery, QueryType, TimeField } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const QUERY_TYPE_OPTIONS: Array<SelectableValue<QueryType>> = [
  { label: 'Telemetry', value: 'telemetry' },
  { label: 'Events', value: 'events' },
];

const TIME_FIELD_OPTIONS: Array<SelectableValue<TimeField>> = [
  { label: 'Receive Time', value: 'ert' },
  { label: 'On-board Time', value: 'time' },
];

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

function keyToChannel(key: string): ChannelRef {
  return JSON.parse(key) as ChannelRef;
}

function toChannelOptions(entries: ChannelRef[]): Array<ComboboxOption<string>> {
  return entries.map((e) => ({
    label: `${e.component}.${e.name}`,
    description: e.component,
    value: channelToKey(e),
  }));
}

function channelValues(channels: ChannelRef[]): string[] {
  return channels.map(channelToKey);
}

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const queryType = query.queryType ?? 'telemetry';

  // Telemetry state
  const [channelOptions, setChannelOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [sourceOptions, setSourceOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [keysByChannel, setKeysByChannel] = useState<Record<string, KeyRef[]>>({});

  const [channelLoading, setChannelLoading] = useState(false);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);

  // Event state
  const [eventSourceOptions, setEventSourceOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [eventSourceLoading, setEventSourceLoading] = useState(false);

  // --- Handlers ---

  const onQueryTypeChange = (value: QueryType) => {
    const updated: MyQuery = {
      ...query,
      queryType: value,
      channels: [],
      keys: [],
      sources: [],
    };
    onChange(updated);
    if (value === 'events') {
      onRunQuery();
    }
  };

  const onChannelChange = (options: Array<ComboboxOption<string>>) => {
    const channels = options.map(({ value }) => keyToChannel(value));
    const updated: MyQuery = { ...query, channels, keys: [], sources: [] };
    onChange(updated);
    if (channels.length) {
      onRunQuery();
    }
  };

  const onSourceChange = (options: Array<ComboboxOption<string>>) => {
    const updated: MyQuery = { ...query, sources: options.map(({ value }) => value) };
    onChange(updated);
    if (queryType === 'telemetry' && updated.channels && updated.channels.length) {
      onRunQuery();
    }
    if (queryType === 'events') {
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

  const onTimeFieldChange = (value: TimeField) => {
    onChange({ ...query, timeField: value });
    onRunQuery();
  };

  const onTimeOverrideFromChange = (date?: DateTime) => {
    onChange({ ...query, timeOverrideFrom: date ? date.toISOString() : undefined });
    onRunQuery();
  };

  const onTimeOverrideToChange = (date?: DateTime) => {
    onChange({ ...query, timeOverrideTo: date ? date.toISOString() : undefined });
    onRunQuery();
  };

  const onAggregationChange = (option: ComboboxOption<Aggregation>) => {
    onChange({ ...query, aggregation: option.value });
    onRunQuery();
  };

  // --- Telemetry data loading ---

  useEffect(() => {
    if (queryType !== 'telemetry') {
      return;
    }
    const loadChannels = async () => {
      setChannelLoading(true);
      datasource
        .getChannels()
        .then((entries) => setChannelOptions(toChannelOptions(entries)))
        .catch(() => setChannelOptions([]))
        .finally(() => setChannelLoading(false));
    };
    loadChannels();
  }, [datasource, queryType]);

  useEffect(() => {
    if (queryType !== 'telemetry') {
      return;
    }
    const loadSources = async () => {
      setSourceLoading(true);
      datasource
        .getSources()
        .then((values) => setSourceOptions(toOptions(values)))
        .catch(() => setSourceOptions([]))
        .finally(() => setSourceLoading(false));
    };
    loadSources();
  }, [datasource, queryType]);

  useEffect(() => {
    if (queryType !== 'telemetry' || !query.channels || !query.channels.length) {
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
  }, [datasource, queryType, query.channels]);

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

  // --- Event data loading ---

  useEffect(() => {
    if (queryType !== 'events') {
      return;
    }
    const loadEventSources = async () => {
      setEventSourceLoading(true);
      datasource
        .getEventSources()
        .then((values) => setEventSourceOptions(toOptions(values)))
        .catch(() => setEventSourceOptions([]))
        .finally(() => setEventSourceLoading(false));
    }
    loadEventSources();
  }, [datasource, queryType]);

  return (
    <>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <RadioButtonGroup
          id="query-editor-query-type"
          options={QUERY_TYPE_OPTIONS}
          value={queryType}
          onChange={onQueryTypeChange}
          size="sm"
          fullWidth={true}
        />
      </div>

      {queryType === 'telemetry' && (
        <>
          <InlineField label="Channel" labelWidth={16} tooltip="Telemetry channel name" grow shrink required>
            <MultiCombobox
              id="query-editor-channel"
              data-testid="query-editor-channel"
              options={channelOptions}
              value={channelValues(query.channels ?? [])}
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
      )}

      {queryType === 'events' && (
        <>
          <InlineField label="Source" labelWidth={16} tooltip="FSW source identifier (optional)" grow shrink>
            <MultiCombobox
              id="query-editor-event-source"
              data-testid="query-editor-event-source"
              options={eventSourceOptions}
              value={query.sources}
              onChange={onSourceChange}
              isClearable
              loading={eventSourceLoading}
              placeholder="All sources"
              prefixIcon="rocket"
            />
          </InlineField>
        </>
      )}

      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <RadioButtonGroup
          id="query-editor-time-field"
          options={TIME_FIELD_OPTIONS}
          value={query.timeField ?? 'ert'}
          onChange={onTimeFieldChange}
          size="sm"
          fullWidth={false}
        />
      </div>
      <CollapsableSection label="Advanced" isOpen={false}>
        <InlineField label="From Override" labelWidth={16} tooltip="Absolute start time (optional)">
          <DateTimePicker
            date={query.timeOverrideFrom ? dateTime(query.timeOverrideFrom) : undefined}
            onChange={onTimeOverrideFromChange}
            clearable
          />
        </InlineField>
        <InlineField label="To Override" labelWidth={16} tooltip="Absolute end time (optional)">
          <DateTimePicker
            date={query.timeOverrideTo ? dateTime(query.timeOverrideTo) : undefined}
            onChange={onTimeOverrideToChange}
            clearable
          />
        </InlineField>
      </CollapsableSection>
    </>
  );
}
