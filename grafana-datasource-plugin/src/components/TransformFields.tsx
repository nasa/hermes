import React from 'react';
import { CollapsableSection, Icon, InlineField, Input, Tooltip } from '@grafana/ui';
import { getTemplateSrv } from '@grafana/runtime';
import { KeyRef, MyQuery, TransformRef } from '../types';
import { normalizeTransform, validateTransformInput, VALUE_TOKEN } from '../query';

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
  if (!rows.length) {
    return null;
  }

  const transforms = query.transforms ?? [];

  const expand = (raw: string) => getTemplateSrv().replace(raw);

  const valueFor = (row: TransformRow): string =>
    transforms.find((t) => matchesRow(t, row))?.expr ?? '';

  const onExprChange = (row: TransformRow, raw: string) => {
    const others = transforms.filter((t) => !matchesRow(t, row));
    const next = raw.trim()
      ? [...others, { component: row.component, channel: row.channel, targetKey: row.targetKey, expr: raw }]
      : others;
    onChange({ ...query, transforms: next });
  };

  const runIfValid = (row: TransformRow) => {
    if (!validateTransformInput(expand(valueFor(row)))) {
      onRunQuery();
    }
  };

  return (
    <CollapsableSection
      label="Value Transform"
      isOpen={transforms.length > 0}
      headerDataTestId="query-editor-transform-section"
    >
      {rows.map((row, index) => {
        const raw = valueFor(row);
        const expanded = expand(raw);
        const error = validateTransformInput(expanded);
        const normalized = normalizeTransform(expanded);
        const isShorthand = normalized !== undefined && !error && normalized !== expanded.trim();
        const inputId = `query-editor-transform-${index}`;
        return (
          <InlineField
            key={row.id}
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
                isShorthand ? (
                  <Tooltip content={`= ${normalized}`}>
                    <Icon name="info-circle" />
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
        );
      })}
    </CollapsableSection>
  );
}
