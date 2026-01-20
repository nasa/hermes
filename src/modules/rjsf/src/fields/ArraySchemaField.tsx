import React from 'react';
import { FieldProps, getUiOptions } from '@rjsf/utils';

export default function ArraySchemaField(props: FieldProps) {
    const { index, registry, uiSchema } = props;
    const { globalUiOptions } = registry;
    const { SchemaField } = registry.fields;
    const name = `Index ${index}`;

    const uiOptions = getUiOptions(uiSchema, globalUiOptions);

    return (
        <SchemaField
            {...props}
            uiSchema={{
                ...uiSchema,
                'ui:options': {
                    ...(uiOptions),
                    arrayItem: true
                },
                'ui:field': (props.uiSchema?.['ui:field']) ??
                    (uiOptions.grid ? 'GridField' : undefined)
            }}
            name={name}
        />
    );
};
