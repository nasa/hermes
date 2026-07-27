import React from 'react';
import { CollapsableSection, DateTimePicker, InlineField, RadioButtonGroup } from '@grafana/ui';
import { dateTime, DateTime, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyQuery, QueryType, TimeField } from '../types';
import { TelemetryFields } from './TelemetryFields';
import { EventFields } from './EventFields';

interface BuilderEditorProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  datasource: DataSource;
}

const QUERY_TYPE_OPTIONS: Array<SelectableValue<QueryType>> = [
  { label: 'Telemetry', value: 'telemetry' },
  { label: 'Events', value: 'events' },
  { label: 'Raw SQL', value: 'raw' },
];

const TIME_FIELD_OPTIONS: Array<SelectableValue<TimeField>> = [
  { label: 'Receive Time', value: 'ert' },
  { label: 'On-board Time', value: 'time' },
];

export function BuilderEditor({ query, onChange, onRunQuery, datasource }: BuilderEditorProps) {
  const queryType = query.queryType ?? 'telemetry';

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

  return (
    <>
      {queryType === 'telemetry' && (
        <TelemetryFields
          query={query}
          onChange={onChange}
          onRunQuery={onRunQuery}
          datasource={datasource}
        />
      )}

      {queryType === 'events' && (
        <EventFields
          query={query}
          onChange={onChange}
          onRunQuery={onRunQuery}
          datasource={datasource}
        />
      )}

      <div style={{ marginTop: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <RadioButtonGroup
          id="query-editor-time-field"
          options={TIME_FIELD_OPTIONS}
          value={query.timeField ?? 'ert'}
          onChange={onTimeFieldChange}
          size="sm"
          fullWidth={false}
        />
        <RadioButtonGroup
          id="query-editor-query-type"
          options={QUERY_TYPE_OPTIONS.filter(opt => opt.value !== 'raw')}
          value={queryType}
          onChange={onQueryTypeChange}
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
