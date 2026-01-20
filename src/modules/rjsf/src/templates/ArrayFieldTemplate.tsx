import React from 'react';
import * as rjsf from "@rjsf/utils";
import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';

import { ActionBar } from '../common/ActionBar';

export default function c({
    canAdd,
    className,
    disabled,
    idSchema,
    uiSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
}: rjsf.ArrayFieldTemplateProps) {
    const uiOptions = rjsf.getUiOptions(uiSchema);
    const ArrayFieldDescriptionTemplate = rjsf.getTemplate<'ArrayFieldDescriptionTemplate'>(
        'ArrayFieldDescriptionTemplate',
        registry,
        uiOptions
    );
    const ArrayFieldItemTemplate = rjsf.getTemplate<'ArrayFieldItemTemplate'>(
        'ArrayFieldItemTemplate',
        registry,
        uiOptions
    );
    const ArrayFieldTitleTemplate = rjsf.getTemplate<'ArrayFieldTitleTemplate'>(
        'ArrayFieldTitleTemplate',
        registry,
        uiOptions
    );

    // Button templates are not overridden in the uiSchema
    const {
        ButtonTemplates: { AddButton },
    } = registry.templates;

    return (
        <fieldset className={className} id={idSchema.$id}>
            <ActionBar actions={canAdd ? [
                <AddButton
                    key={0}
                    onClick={onAddClick}
                    disabled={disabled || readonly}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            ] : []}>
                <ArrayFieldTitleTemplate
                    idSchema={idSchema}
                    title={uiOptions.title || title}
                    required={required}
                    schema={schema}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            </ActionBar>
            <ArrayFieldDescriptionTemplate
                idSchema={idSchema}
                description={uiOptions.description || schema.description}
                schema={schema}
                uiSchema={uiSchema}
                registry={registry}
            />
            {items ?
                (uiOptions.grid && typeof schema.items === "object" && !Array.isArray(schema.items)) ? (
                    <VSCodeDataGrid gridTemplateColumns={String(uiOptions["gridTemplateColumns"])}>
                        <VSCodeDataGridRow row-type="sticky-header">
                            {Object.entries(schema.items.properties ?? {}).map(([name, value], index) => (
                                <VSCodeDataGridCell key={name} cell-type="columnheader" grid-column={index + 1}>
                                    {(value as any).title ?? name}
                                </VSCodeDataGridCell>
                            ))}

                            <VSCodeDataGridCell cell-type="columnheader" grid-column={Object.keys(schema.items.properties ?? {}).length + 1}>
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>
                        {items.map(({ key, ...itemProps }: rjsf.ArrayFieldTemplateItemType & { grid?: boolean }) => (
                            <ArrayFieldItemTemplate key={key} {...{ grid: true }} {...itemProps} />
                        ))}
                    </VSCodeDataGrid>
                ) : (
                    items.map(({ key, ...itemProps }: rjsf.ArrayFieldTemplateItemType) => (
                        <ArrayFieldItemTemplate key={key} {...itemProps} />
                    ))
                ) : null}
        </fieldset>
    );
}