import React, { useState } from 'react';
import { CollapsableSection, Icon, InlineField, Input, Tooltip } from '@grafana/ui';
import { getTemplateSrv } from '@grafana/runtime';
import { KeyRef, MyQuery, TransformRef } from '../types';
import { namePreview, transformPreview, validateTransformInput, VALUE_TOKEN } from '../query';

interface TransformFieldsProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  keysByChannel: Record<string, KeyRef[]>;
}

interface TransformRow {
  id: string;
  component: string;
  channel: string;
  targetKey?: string;
  label: string;
}

const SYNTAX_HELP = (
  <div>
    <p>
      Enter a plain number to multiply by it, or any PostgreSQL expression using{' '}
      <code>{VALUE_TOKEN}</code> for the stored value.
    </p>
    <p>
      Examples: <code>2</code>, <code>0.001</code>, <code>{`${VALUE_TOKEN} - 273.15`}</code>,{' '}
      <code>{`${VALUE_TOKEN} * 9.0/5.0 + 32`}</code>, <code>{`ABS(${VALUE_TOKEN})`}</code>
    </p>
    <p>Applies to numeric channels only. Boolean, string, and byte values are unaffected.</p>
  </div>
);

const NAME_HELP = (
  <div>
    <p>Override the display name shown for this series in the legend and tooltips.</p>
    <p>
      Leave empty to use the default name. Template variables (e.g. <code>$var</code>) are
      expanded. A panel&apos;s &quot;Display name&quot; option still takes precedence.
    </p>
  </div>
);

export function transformId(component: string, channel: string, targetKey?: string): string {
  return `${component}\0${channel}\0${targetKey ?? ''}`;
}

function matchesRow(t: TransformRef, row: TransformRow): boolean {
  return transformId(t.component, t.channel, t.targetKey) === row.id;
}

export function buildTransformRows(
  keysByChannel: Record<string, KeyRef[]>,
  selectedKeys: KeyRef[]
): TransformRow[] {
  const rows: TransformRow[] = [];
  for (const keys of Object.values(keysByChannel)) {
    if (!keys.length) {
      continue;
    }
    const { component, channel } = keys[0];
    if (keys.length <= 1) {
      rows.push({
        id: transformId(component, channel),
        component,
        channel,
        label: `${component}.${channel}`,
      });
      continue;
    }
    const selectedForChannel = selectedKeys.filter(
      (k) => k.component === component && k.channel === channel
    );
    const forChannel = selectedForChannel.length ? selectedForChannel : keys;
    for (const k of forChannel) {
      rows.push({
        id: transformId(component, channel, k.key),
        component,
        channel,
        targetKey: k.key,
        label: `${component}.${channel}.${k.key}`,
      });
    }
  }
  return rows;
}

export function TransformFields({ query, onChange, onRunQuery, keysByChannel }: TransformFieldsProps) {
  const rows = buildTransformRows(keysByChannel, query.keys ?? []);
  const transforms = query.transforms ?? [];
  const [isOpen, setIsOpen] = useState(transforms.length > 0);

  if (!rows.length) {
    return null;
  }

  const expand = (raw: string) => getTemplateSrv().replace(raw);

  const valueFor = (row: TransformRow): string =>
    transforms.find((t) => matchesRow(t, row))?.expr ?? '';

  const nameFor = (row: TransformRow): string =>
    transforms.find((t) => matchesRow(t, row))?.name ?? '';

  // Insert/update/remove the transform for a row. A row is kept when it has a
  // non-empty expression OR a non-empty name override, and dropped only when
  // both are empty.
  const upsertRow = (row: TransformRow, patch: { expr?: string; name?: string }) => {
    const current = transforms.find((t) => matchesRow(t, row));
    const others = transforms.filter((t) => !matchesRow(t, row));
    const expr = (patch.expr ?? current?.expr ?? '');
    const name = (patch.name ?? current?.name ?? '');
    const next = expr.trim() || name.trim()
      ? [
          ...others,
          {
            component: row.component,
            channel: row.channel,
            targetKey: row.targetKey,
            expr,
            ...(name.trim() ? { name } : {}),
          },
        ]
      : others;
    onChange({ ...query, transforms: next });
  };

  const onExprChange = (row: TransformRow, raw: string) => upsertRow(row, { expr: raw });
  const onNameChange = (row: TransformRow, raw: string) => upsertRow(row, { name: raw });

  const runIfValid = (row: TransformRow) => {
    if (!validateTransformInput(expand(valueFor(row)))) {
      onRunQuery();
    }
  };

  return (
    <CollapsableSection
      label="Value Transform"
      isOpen={isOpen}
      onToggle={setIsOpen}
      headerDataTestId="query-editor-transform-section"
    >
      {rows.map((row, index) => {
        const raw = valueFor(row);
        const alias = nameFor(row);
        const error = validateTransformInput(expand(raw));
        const preview = transformPreview(raw, expand);
        const aliasPreview = namePreview(alias, expand);
        const inputId = `query-editor-transform-${index}`;
        return (
          <React.Fragment key={row.id}>
            <InlineField
              label={row.label}
              tooltip={SYNTAX_HELP}
              interactive
              invalid={!!error}
              error={error}
              grow
              shrink
            >
              <Input
                id={inputId}
                data-testid={`query-editor-transform-${row.label}`}
                value={raw}
                placeholder={VALUE_TOKEN}
                invalid={!!error}
                prefix={<Icon name="calculator-alt" />}
                suffix={
                  preview ? (
                    <Tooltip content={`= ${preview}`}>
                      <span data-testid={`query-editor-transform-preview-${row.label}`} title={`= ${preview}`}>
                        <Icon name="info-circle" />
                      </span>
                    </Tooltip>
                  ) : undefined
                }
                onChange={(e) => onExprChange(row, e.currentTarget.value)}
                onBlur={() => runIfValid(row)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    runIfValid(row);
                  }
                }}
              />
            </InlineField>
            <InlineField
              label="Display name"
              tooltip={NAME_HELP}
              interactive
              grow
              shrink
            >
              <Input
                id={`query-editor-alias-${index}`}
                data-testid={`query-editor-alias-${row.label}`}
                value={alias}
                placeholder={row.label}
                prefix={<Icon name="pen" />}
                suffix={
                  aliasPreview ? (
                    <Tooltip content={`= ${aliasPreview}`}>
                      <span data-testid={`query-editor-alias-preview-${row.label}`} title={`= ${aliasPreview}`}>
                        <Icon name="info-circle" />
                      </span>
                    </Tooltip>
                  ) : undefined
                }
                onChange={(e) => onNameChange(row, e.currentTarget.value)}
                onBlur={() => runIfValid(row)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    runIfValid(row);
                  }
                }}
              />
            </InlineField>
          </React.Fragment>
        );
      })}
    </CollapsableSection>
  );
}
