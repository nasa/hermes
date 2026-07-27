import React, { useState } from 'react';
import { css } from '@emotion/css';
import { ConfirmModal, RadioButtonGroup } from '@grafana/ui';
import { dateTime, QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery, withDefaults } from '../types';
import { BuilderEditor } from './BuilderEditor';
import { SqlEditor } from './SqlEditor';
import { buildQuery } from '../query';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const EDITOR_MODE_OPTIONS: Array<SelectableValue<string>> = [
  { label: 'Builder', value: 'builder' },
  { label: 'Code', value: 'code' },
];

export function QueryEditor({ query, onChange, onRunQuery, datasource, range }: Props) {
  const [editorMode, setEditorMode] = useState<string>('builder');
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [builderQueryType, setBuilderQueryType] = useState<string>(query.queryType ?? 'telemetry');
  const [generatedSql, setGeneratedSql] = useState<string | undefined>(undefined);

  const onEditorModeChange = (mode: string) => {
    if (mode === 'builder' && editorMode === 'code') {
      const userEdited = query.rawSql?.trim() && query.rawSql !== generatedSql;
      if (userEdited) {
        setShowConfirmSwitch(true);
        return;
      }
      onChange({ ...query, rawSql: undefined, queryType: builderQueryType as any });
      setEditorMode('builder');
      onRunQuery();
      return;
    }
    if (mode === 'code') {
      setBuilderQueryType(query.queryType ?? 'telemetry');
    }
    setEditorMode(mode);
    if (mode === 'code') {
      try {
        const filled = withDefaults(query);
        const from = range?.from ?? dateTime();
        const to = range?.to ?? dateTime();
        const sql = buildQuery(filled, { range: { from, to, raw: { from, to } } } as any);
        setGeneratedSql(sql);
        onChange({ ...query, rawSql: sql, queryType: 'raw' });
      } catch (e) {
        console.warn('Could not generate SQL for code editor:', e);
      }
    }
  };

  return (
    <>
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <RadioButtonGroup
          id="query-editor-editor-mode"
          options={EDITOR_MODE_OPTIONS}
          value={editorMode}
          onChange={onEditorModeChange}
          size="sm"
          fullWidth={true}
        />
      </div>

      {editorMode === 'builder' && (
        <BuilderEditor
          query={query}
          onChange={onChange}
          onRunQuery={onRunQuery}
          datasource={datasource}
        />
      )}

      {editorMode === 'code' && (
        <SqlEditor
          query={query}
          onChange={onChange}
          onRunQuery={onRunQuery}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmSwitch}
        title="Warning"
        body={
          <>
            <p>Builder mode does not display changes made in code. The query builder will display the last changes you made in builder mode.</p>
            <p>Do you want to copy your code to the clipboard?</p>
          </>
        }
        modalClass={css({ minWidth: 600 })}
        confirmText="Copy code and switch"
        alternativeText="Discard code and switch"
        dismissText="Cancel"
        onConfirm={() => {
          navigator.clipboard.writeText(query.rawSql ?? '');
          onChange({ ...query, rawSql: undefined, queryType: builderQueryType as any });
          setEditorMode('builder');
          setShowConfirmSwitch(false);
          onRunQuery();
        }}
        onAlternative={() => {
          onChange({ ...query, rawSql: undefined, queryType: builderQueryType as any });
          setEditorMode('builder');
          setShowConfirmSwitch(false);
          onRunQuery();
        }}
        onDismiss={() => setShowConfirmSwitch(false)}
      />
    </>
  );
}
