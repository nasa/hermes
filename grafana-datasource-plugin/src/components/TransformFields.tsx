import React, { useState } from 'react';
import { CollapsableSection, Icon, InlineField, Input, Tooltip } from '@grafana/ui';
import { getTemplateSrv } from '@grafana/runtime';
import { MemberRef, MyQuery, TransformRef } from '../types';
import { namePreview, transformPreview, validateTransformInput, VALUE_TOKEN } from '../query';

interface TransformFieldsProps {
  query: MyQuery;
  onChange: (query: MyQuery) => void;
  onRunQuery: () => void;
  membersByParameter: Record<string, MemberRef[]>;
}

interface TransformRow {
  id: string;
  spaceSystem: string;
  parameter: string;
  member?: string;
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
    <p>Applies to numeric parameters only. Boolean, string, and byte values are unaffected.</p>
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

export function transformId(spaceSystem: string, parameter: string, member?: string): string {
  return `${spaceSystem}\0${parameter}\0${member ?? ''}`;
}

function matchesRow(t: TransformRef, row: TransformRow): boolean {
  return transformId(t.spaceSystem, t.parameter, t.member) === row.id;
}

export function buildTransformRows(
  membersByParameter: Record<string, MemberRef[]>,
  selectedMembers: MemberRef[]
): TransformRow[] {
  const rows: TransformRow[] = [];
  for (const members of Object.values(membersByParameter)) {
    if (!members.length) {
      continue;
    }
    const { spaceSystem, parameter } = members[0];
    if (members.length <= 1) {
      rows.push({
        id: transformId(spaceSystem, parameter),
        spaceSystem,
        parameter,
        label: `${spaceSystem}/${parameter}`,
      });
      continue;
    }
    const selectedForParameter = selectedMembers.filter(
      (m) => m.spaceSystem === spaceSystem && m.parameter === parameter
    );
    const forParameter = selectedForParameter.length ? selectedForParameter : members;
    for (const m of forParameter) {
      rows.push({
        id: transformId(spaceSystem, parameter, m.member),
        spaceSystem,
        parameter,
        member: m.member,
        label: `${spaceSystem}/${parameter}${m.member}`,
      });
    }
  }
  return rows;
}

export function TransformFields({ query, onChange, onRunQuery, membersByParameter }: TransformFieldsProps) {
  const rows = buildTransformRows(membersByParameter, query.members ?? []);
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
            spaceSystem: row.spaceSystem,
            parameter: row.parameter,
            member: row.member,
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
