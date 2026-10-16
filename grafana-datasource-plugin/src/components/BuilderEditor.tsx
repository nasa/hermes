import React from 'react';
import { CollapsableSection, DateTimePicker, InlineField, RadioButtonGroup } from '@grafana/ui';
import { dateTime, DateTime, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyQuery, TimeField } from '../types';
import { TelemetryFields } from './TelemetryFields';

interface BuilderEditorProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  datasource: DataSource;
}

const TIME_FIELD_OPTIONS: Array<SelectableValue<TimeField>> = [
  { label: 'Generation Time', value: 'generation_time' },
  { label: 'Acquisition Time', value: 'acquisition_time' },
];

export function BuilderEditor({ query, onChange, onRunQuery, datasource }: BuilderEditorProps) {
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

  const sharedOptions = (
    <div style={{ marginTop: 8, marginBottom: 8 }}>
      <RadioButtonGroup
        id="query-editor-time-field"
        options={TIME_FIELD_OPTIONS}
        value={query.timeField ?? 'generation_time'}
        onChange={onTimeFieldChange}
        size="sm"
        fullWidth={false}
      />
    </div>
  );

  return (
    <>
      <TelemetryFields
        query={query}
        onChange={onChange}
        onRunQuery={onRunQuery}
        datasource={datasource}
        sharedOptions={sharedOptions}
      />

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
