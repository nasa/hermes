import React, { useState } from 'react';
import { css } from '@emotion/css';
import { ConfirmModal } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { BuilderEditor } from './BuilderEditor';
import { SqlEditor } from './SqlEditor';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const [editorMode, setEditorMode] = useState<string>('builder');
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);

  const onEditorModeChange = (mode: string) => {
    if (mode === 'builder' && editorMode === 'code') {
      setShowConfirmSwitch(true);
      return;
    }
    setEditorMode(mode);
    if (mode === 'code') {
      datasource
        .getRawSql(query)
        .then((sql) => onChange({ ...query, rawSql: sql }))
        .catch(() => {});
    }
  };

  return (
    <>
      {editorMode === 'builder' && (
        <BuilderEditor
          query={query}
          onChange={onChange}
          onRunQuery={onRunQuery}
          datasource={datasource}
          editorMode={editorMode}
          onEditorModeChange={onEditorModeChange}
        />
      )}

      {editorMode === 'code' && (
        <SqlEditor
          query={query}
          onChange={onChange}
          onRunQuery={onRunQuery}
          editorMode={editorMode}
          onEditorModeChange={onEditorModeChange}
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
          setEditorMode('builder');
          setShowConfirmSwitch(false);
        }}
        onAlternative={() => {
          setEditorMode('builder');
          setShowConfirmSwitch(false);
        }}
        onDismiss={() => setShowConfirmSwitch(false)}
      />
    </>
  );
}
