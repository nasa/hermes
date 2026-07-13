import React, { useEffect, useState } from 'react';
import { ComboboxOption, InlineField, MultiCombobox } from '@grafana/ui';
import { DataSource } from '../datasource';
import { MyQuery } from '../types';

interface EventFieldsProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  datasource: DataSource;
}

function toOptions(values: string[]): Array<ComboboxOption<string>> {
  return values.map((v) => ({ label: v, value: v }));
}

export function EventFields({ query, onChange, onRunQuery, datasource }: EventFieldsProps) {
  const [eventSourceOptions, setEventSourceOptions] = useState<Array<ComboboxOption<string>>>([]);
  const [eventSourceLoading, setEventSourceLoading] = useState(false);

  const onSourceChange = (options: Array<ComboboxOption<string>>) => {
    const updated: MyQuery = { ...query, sources: options.map(({ value }) => value) };
    onChange(updated);
    onRunQuery();
  };

  useEffect(() => {
    const loadEventSources = async () => {
      setEventSourceLoading(true);
      datasource
        .getEventSources()
        .then((values) => setEventSourceOptions(toOptions(values)))
        .catch(() => setEventSourceOptions([]))
        .finally(() => setEventSourceLoading(false));
    }
    loadEventSources();
  }, [datasource]);

  return (
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
  );
}
