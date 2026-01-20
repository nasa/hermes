import React from 'react';

import DefaultObjectField from '@rjsf/core/lib/components/fields/ObjectField';

import {
    getTemplate,
    getUiOptions,
    orderProperties,
    FieldProps,
    IdSchema,
    TranslatableString,
    ADDITIONAL_PROPERTY_FLAG,
    PROPERTIES_KEY,
} from '@rjsf/utils';
import Markdown from 'markdown-to-jsx';
import get from 'lodash/get';
import has from 'lodash/has';

import { schemaSupportsGrid } from '../common/utils';

class ObjectField extends DefaultObjectField<
    FieldProps
> {
    render() {
        const {
            schema: rawSchema,
            uiSchema = {},
            formData,
            errorSchema,
            idSchema,
            name,
            required = false,
            disabled = false,
            readonly = false,
            hideError,
            idPrefix,
            idSeparator,
            onBlur,
            onFocus,
            registry,
            title,
        } = this.props;

        const { fields, formContext, schemaUtils, translateString, globalUiOptions } = registry;
        const { SchemaField } = fields;
        const schema = schemaUtils.retrieveSchema(rawSchema, formData);
        const uiOptions = getUiOptions(uiSchema, globalUiOptions);
        const { properties: schemaProperties = {} } = schema;

        const templateTitle = uiOptions.title ?? schema.title ?? title ?? name;
        const description = uiOptions.description ?? schema.description;
        let orderedProperties: string[];
        try {
            const properties = Object.keys(schemaProperties);
            orderedProperties = orderProperties(properties, uiOptions.order);
        } catch (err) {
            return (
                <div>
                    <p className='config-error' style={{ color: 'red' }}>
                        <Markdown>
                            {translateString(TranslatableString.InvalidObjectField, [name || 'root', (err as Error).message])}
                        </Markdown>
                    </p>
                    <pre>{JSON.stringify(schema)}</pre>
                </div>
            );
        }

        const isGridEntry = (ADDITIONAL_PROPERTY_FLAG in rawSchema) && schemaSupportsGrid(rawSchema);

        const Template = getTemplate('ObjectFieldTemplate', registry, uiOptions);

        const templateProps = {
            // getDisplayLabel() always returns false for object types, so just check the `uiOptions.label`
            title: uiOptions.label === false ? '' : templateTitle,
            description: uiOptions.label === false ? undefined : description,
            properties: orderedProperties.map((name, propertyIndex) => {
                const addedByAdditionalProperties = has(schema, [PROPERTIES_KEY, name, ADDITIONAL_PROPERTY_FLAG]);
                const fieldUiSchema = addedByAdditionalProperties ? uiSchema.additionalProperties : uiSchema[name];
                const hidden = getUiOptions(fieldUiSchema).widget === 'hidden';
                const fieldIdSchema = (get(idSchema as IdSchema, [name], {})) as any;

                return {
                    content: (
                        <SchemaField
                            key={name}
                            name={name}
                            required={this.isRequired(name)}
                            schema={get(schema, [PROPERTIES_KEY, name], {})}
                            uiSchema={{
                                ...fieldUiSchema,
                                'ui:options': {
                                    ...fieldUiSchema?.['ui:options'],
                                    label: (isGridEntry || addedByAdditionalProperties) ? false : fieldUiSchema?.['ui:options']?.label,
                                    gridItem: isGridEntry ? propertyIndex + 2 : undefined
                                }
                            }}
                            errorSchema={get(errorSchema, name)}
                            idSchema={fieldIdSchema}
                            idPrefix={idPrefix}
                            idSeparator={idSeparator}
                            formData={get(formData, name)}
                            formContext={formContext}
                            wasPropertyKeyModified={this.state.wasPropertyKeyModified}
                            onKeyChange={this.onKeyChange(name)}
                            onChange={this.onPropertyChange(name, addedByAdditionalProperties)}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            registry={registry}
                            disabled={disabled}
                            readonly={readonly}
                            hideError={hideError}
                            onDropPropertyClick={this.onDropPropertyClick}
                        />
                    ),
                    name,
                    readonly,
                    disabled,
                    required,
                    hidden,
                };
            }),
            readonly,
            disabled,
            required,
            idSchema,
            uiSchema,
            errorSchema,
            schema,
            formData,
            formContext,
            registry,
        };
        return <Template {...templateProps} onAddClick={this.handleAddClick} />;
    }
}

export default ObjectField;
