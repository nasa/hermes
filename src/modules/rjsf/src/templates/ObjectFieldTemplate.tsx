import React, { useMemo } from 'react';
import {
    ADDITIONAL_PROPERTY_FLAG,
    FormContextType,
    ObjectFieldTemplatePropertyType,
    ObjectFieldTemplateProps,
    RJSFSchema,
    StrictRJSFSchema,
    canExpand,
    descriptionId,
    getTemplate,
    getUiOptions,
} from '@rjsf/utils';

import {
    VSCodeBadge,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
} from '@vscode/webview-ui-toolkit/react';

import { ActionBar } from '../common';
import { schemaSupportsGrid } from '../common/utils';

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ObjectFieldTemplateProps<T, S, F>) {
    const {
        description,
        disabled,
        formData,
        idSchema,
        onAddClick,
        properties,
        readonly,
        registry,
        required,
        schema,
        title,
        uiSchema,
    } = props;
    const options = getUiOptions<T, S, F>(uiSchema);
    const ArrayFieldTitleTemplate = getTemplate<'ArrayFieldTitleTemplate', T, S, F>('ArrayFieldTitleTemplate', registry, options);
    const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
        'DescriptionFieldTemplate',
        registry,
        options
    );
    // Button templates are not overridden in the uiSchema
    const {
        ButtonTemplates: { AddButton },
    } = registry.templates;

    const additional = ADDITIONAL_PROPERTY_FLAG in schema;

    const gridColumns: {
        name: string;
        description?: string;
    }[] | null = useMemo(() => {
        if (typeof schema.additionalProperties === "object") {
            switch (schema.additionalProperties.type) {
                case "array":
                    // cannot be displayed as a grid with a static header
                    break;
                case "object":
                    // Check if this can be rendered by a grid
                    // It must be an object of primitives
                    if (schemaSupportsGrid(schema.additionalProperties)) {
                        return [
                            {
                                name: "Key"
                            },
                            ...(Object.entries(
                                schema.additionalProperties.properties ?? {}
                            ).map(([name, value]) => ({
                                name,
                                description: (typeof value === "object" ? value.description : undefined)
                            })))
                        ];
                    }
                    break;
                case "boolean":
                case "integer":
                case "null":
                case "number":
                case "string":
                    // Always supports grid since these are primitives
                    return [
                        {
                            name: "Key"
                        },
                        {
                            name: "Value",
                            description: schema.additionalProperties.description
                        }
                    ];
            }
        }

        return null;
    }, [schema]);

    const gridTemplateColumns = useMemo(() => (
        gridColumns?.map(() => '1fr')?.join(' ')
    ), [gridColumns]);

    if (additional) {
        return (
            properties.map((prop: ObjectFieldTemplatePropertyType, index) => (
                <VSCodeDataGridCell key={prop.name} gridColumn={String(index + 2)}>
                    {prop.content}
                </VSCodeDataGridCell>
            ))
        );
    }

    return (
        <fieldset id={idSchema.$id}>
            {title && (
                <ActionBar actions={canExpand<T, S, F>(schema, uiSchema, formData) ? [
                    <AddButton
                        key={0}
                        className='object-property-expand'
                        onClick={onAddClick(schema)}
                        disabled={disabled || readonly}
                        uiSchema={uiSchema}
                        registry={registry}
                    />
                ] : []}>
                    <ArrayFieldTitleTemplate
                        idSchema={idSchema}
                        title={title}
                        required={required}
                        schema={schema}
                        uiSchema={uiSchema}
                        registry={registry}
                    />
                </ActionBar>
            )}
            {description && (
                <DescriptionFieldTemplate
                    id={descriptionId<T>(idSchema)}
                    description={description}
                    schema={schema}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            )}

            {(gridColumns && gridTemplateColumns) ? (
                <VSCodeDataGrid gridTemplateColumns={gridTemplateColumns}>
                    <VSCodeDataGridRow row-type="header">
                        {gridColumns.map(({ name, description }, index) => (
                            <VSCodeDataGridCell key={index} cell-type="columnheader" gridColumn={String(index + 1)}>
                                {name}

                                {description && (
                                    <VSCodeBadge
                                        data-tooltip-id='rjsf-tooltip'
                                        data-tooltip-content={description}
                                    >
                                        ?
                                    </VSCodeBadge>
                                )}
                            </VSCodeDataGridCell>
                        ))}
                    </VSCodeDataGridRow>

                    {properties.map((prop: ObjectFieldTemplatePropertyType) => (
                        prop.content
                    ))}

                </VSCodeDataGrid>
            ) : (
                properties.map((prop: ObjectFieldTemplatePropertyType) => prop.content)
            )}
        </fieldset>
    );
}
