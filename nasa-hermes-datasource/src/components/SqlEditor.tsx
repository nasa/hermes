import React from 'react';
import { Button, CodeEditor } from '@grafana/ui';
import { MyQuery } from '../types';

interface SqlEditorProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
}

export function SqlEditor({ query, onChange, onRunQuery }: SqlEditorProps) {
  return (
    <>
      <div style={{ marginTop: 8, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontWeight: 500 }}>Manual query editor</span>
        <Button variant="primary" size="sm" icon="play" onClick={() => {
          onChange({ ...query, queryType: 'raw' });
          onRunQuery();
        }}>
          Run query
        </Button>
      </div>
      <CodeEditor
        value={query.rawSql ?? ''}
        language="sql"
        height={250}
        showMiniMap={false}
        showLineNumbers={true}
        onChange={(value) => onChange({ ...query, rawSql: value })}
        onSave={(value) => {
          onChange({ ...query, rawSql: value, queryType: 'raw' });
          onRunQuery();
        }}
        onBlur={(value) => {
          onChange({ ...query, rawSql: value });
        }}
      />
    </>
  );
}
