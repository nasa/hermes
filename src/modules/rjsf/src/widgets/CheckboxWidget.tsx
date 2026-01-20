import React, { useCallback } from 'react';
import * as rjsf from "@rjsf/utils";

import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';

export function CheckboxWidget({
    schema,
    options,
    uiSchema,
    id,
    value,
    disabled,
    label,
    hideLabel,
    onBlur,
    onFocus,
    onChange,
    registry,
}: rjsf.WidgetProps) {
    const DescriptionFieldTemplate = rjsf.getTemplate<'DescriptionFieldTemplate'>(
        'DescriptionFieldTemplate',
        registry,
        options
    );

    const handleChange = useCallback((e: any) => {
        onChange(e.target.checked);
    }, [onChange]);

    const handleBlur = useCallback(
        (event: any) => onBlur(id, event.target.checked),
        [onBlur, id]
    );

    const handleFocus = useCallback(
        (event: any) => onFocus(id, event.target.checked),
        [onFocus, id]
    );

    const description = options.description ?? schema.description;
    if (hideLabel || !description || description.length === 0) {
        return (
            <VSCodeCheckbox
                disabled={disabled}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                checked={value ?? false}
            >
                {!hideLabel && label}
            </VSCodeCheckbox>
        );
    } else {
        return (<>
            <VSCodeCheckbox
                disabled={disabled}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                checked={value ?? false}
            >
                {!hideLabel && label}
            </VSCodeCheckbox>
            {!hideLabel && !!description && (
                <DescriptionFieldTemplate
                    id={rjsf.descriptionId(id)}
                    description={description}
                    schema={schema}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            )}
        </>);
    }
}
