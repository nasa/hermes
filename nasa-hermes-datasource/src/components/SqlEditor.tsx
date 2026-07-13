import React from 'react';
import { Button, CodeEditor, RadioButtonGroup } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { MyQuery } from '../types';

interface SqlEditorProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  editorMode: string;
  onEditorModeChange: (mode: string) => void;
}

const EDITOR_MODE_OPTIONS: Array<SelectableValue<string>> = [
  { label: 'Builder', value: 'builder' },
  { label: 'Code', value: 'code' },
];

export function SqlEditor({ query, onChange, onRunQuery, editorMode, onEditorModeChange }: SqlEditorProps) {
  return (
    <>
      <div style={{ marginTop: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontWeight: 500 }}>Manual query editor</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="primary" size="sm" icon="play" onClick={onRunQuery}>
            Run query
          </Button>
          <RadioButtonGroup
            id="query-editor-editor-mode-code"
            options={EDITOR_MODE_OPTIONS}
            value={editorMode}
            onChange={onEditorModeChange}
            size="sm"
            fullWidth={false}
          />
        </div>
      </div>
      <CodeEditor
        value={query.rawSql ?? ''}
        language="sql"
        height={200}
        showMiniMap={false}
        showLineNumbers={true}
        onChange={(value) => onChange({ ...query, rawSql: value })}
        onBlur={(value) => {
          onChange({ ...query, rawSql: value });
          onRunQuery();
        }}
      />
    </>
  );
}
