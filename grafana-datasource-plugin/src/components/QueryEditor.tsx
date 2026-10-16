import React, { useState } from 'react';
import { css } from '@emotion/css';
import { ConfirmModal, RadioButtonGroup } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery, ResolvedQuery, withDefaults } from '../types';
import { BuilderEditor } from './BuilderEditor';
import { SqlEditor } from './SqlEditor';
import { buildQuery, resolveQuery } from '../query';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const EDITOR_MODE_OPTIONS: Array<SelectableValue<string>> = [
  { label: 'Builder', value: 'builder' },
  { label: 'Code', value: 'code' },
];

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  // We show Code mode whenever the query has SQL. Only Code mode stores SQL, and the
  // datasource runs stored SQL instead of building it from the Builder's fields.
  const editorMode = query.rawSql === undefined ? 'builder' : 'code';
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [generatedSql, setGeneratedSql] = useState<string | undefined>(undefined);

  const onEditorModeChange = async (mode: string) => {
    if (mode === 'builder' && editorMode === 'code') {
      const userEdited = query.rawSql?.trim() && query.rawSql !== generatedSql;
      if (userEdited) {
        setShowConfirmSwitch(true);
        return;
      }
      onChange({ ...query, rawSql: undefined });
      onRunQuery();
      return;
    }
    if (mode === 'code') {
      try {
        const filled = withDefaults(query);
        const templateSrv = getTemplateSrv();
        const needsParameters = (filled.parameters ?? []).some((p) => p.raw !== undefined);
        const known = needsParameters ? await datasource.getParameters().catch(() => []) : [];
        const resolved: ResolvedQuery = resolveQuery(filled, (value) => templateSrv.replace(value), known);
        const sql = buildQuery(resolved);
        setGeneratedSql(sql);
        onChange({ ...query, rawSql: sql });
      } catch (e) {
        console.warn('Could not generate SQL for code editor:', e);
        // With no parameter picked there is no SQL to generate, so we open an empty editor.
        onChange({ ...query, rawSql: '' });
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
          onChange({ ...query, rawSql: undefined });
          setShowConfirmSwitch(false);
          onRunQuery();
        }}
        onAlternative={() => {
          onChange({ ...query, rawSql: undefined });
          setShowConfirmSwitch(false);
          onRunQuery();
        }}
        onDismiss={() => setShowConfirmSwitch(false)}
      />
    </>
  );
}
