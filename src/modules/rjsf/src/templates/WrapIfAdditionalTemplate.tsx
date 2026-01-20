import React from 'react';

import {
    ADDITIONAL_PROPERTY_FLAG,
    FormContextType,
    RJSFSchema,
    StrictRJSFSchema,
    WrapIfAdditionalTemplateProps,
    getUiOptions,
} from '@rjsf/utils';

import {
    VSCodeDataGridCell,
    VSCodeDataGridRow,
    VSCodeTextField
} from '@vscode/webview-ui-toolkit/react';

import { schemaSupportsGrid } from '../common/utils';
import { ActionBar } from '../common';

/** The `WrapIfAdditional` component is used by the `FieldTemplate` to rename, or remove properties that are
 * part of an `additionalProperties` part of a schema.
 *
 * @param props - The `WrapIfAdditionalProps` for this component
 */
export default function WrapIfAdditionalTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: WrapIfAdditionalTemplateProps<T, S, F>) {
    const {
        id,
        classNames,
        style,
        disabled,
        label,
        onKeyChange,
        onDropPropertyClick,
        readonly,
        schema,
        children,
        uiSchema,
        registry,
    } = props;

    const { templates } = registry;

    // Button templates are not overridden in the uiSchema
    const { RemoveButton } = templates.ButtonTemplates;
    const additional = ADDITIONAL_PROPERTY_FLAG in schema;

    const uiOptions = getUiOptions(uiSchema);

    if (uiOptions.arrayItem) {
        return children;
    }

    if (!additional) {
        return (
            <div className={classNames} style={style}>
                {children}
            </div>
        );
    }

    switch (schema.type) {
        case "array":
            // We don't support dynamic 2d arrays in grid format
            break;
        case "object":
            if (schemaSupportsGrid(schema)) {
                // Render a grid with the first column as the key
                const filteredChildren = React.Children.toArray(children).filter(Boolean);
                return (
                    <VSCodeDataGridRow>
                        <VSCodeDataGridCell gridColumn='1'>
                            <VSCodeTextField
                                id={`${id}-key`}
                                value={label}
                                disabled={props.disabled}
                                onBlur={(event) => onKeyChange((event.target as any).value)}
                                required={props.required}
                            />
                        </VSCodeDataGridCell>
                        {children}
                        <VSCodeDataGridCell gridColumn={String(React.Children.count(filteredChildren) + 2)}>
                            <RemoveButton
                                className='grid-row-action-button'
                                disabled={disabled || readonly}
                                onClick={onDropPropertyClick(label)}
                                uiSchema={uiSchema}
                                registry={registry}
                            />
                        </VSCodeDataGridCell>
                    </VSCodeDataGridRow>
                );
            }

            // Fallback to column rendered form
            break;
        case "boolean":
        case "integer":
        case "null":
        case "number":
        case "string":
            // This is a simple grid
            return (
                <VSCodeDataGridRow>
                    <VSCodeDataGridCell gridColumn='1'>
                        <VSCodeTextField
                            id={`${id}-key`}
                            value={label}
                            disabled={props.disabled}
                            onBlur={(event) => onKeyChange((event.target as any).value)}
                            required={props.required}
                        />
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell gridColumn='2'>
                        {children}
                    </VSCodeDataGridCell>
                    <VSCodeDataGridCell gridColumn='3'>
                        <RemoveButton
                            className='grid-row-action-button'
                            disabled={disabled || readonly}
                            onClick={onDropPropertyClick(label)}
                            uiSchema={uiSchema}
                            registry={registry}
                        />
                    </VSCodeDataGridCell>
                </VSCodeDataGridRow>
            );
    }

    return (
        <fieldset className={classNames} style={style}>
            <ActionBar actions={[
                <RemoveButton
                    key={0}
                    disabled={disabled || readonly}
                    onClick={onDropPropertyClick(label)}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            ]}>
                <VSCodeTextField
                    id={`${id}-key`}
                    value={label}
                    disabled={props.disabled}
                    onBlur={(event) => onKeyChange((event.target as any).value)}
                    required={props.required}
                >
                    Key
                </VSCodeTextField>
            </ActionBar>

            {children}
        </fieldset>
    );
}
