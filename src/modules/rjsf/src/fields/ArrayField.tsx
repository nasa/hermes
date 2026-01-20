import React from 'react';

import DefaultArrayField from '@rjsf/core/lib/components/fields/ArrayField';
import { ErrorSchema, FieldProps, FormContextType, IdSchema, RJSFSchema, StrictRJSFSchema, UiSchema, getUiOptions } from '@rjsf/utils';

class ArrayField<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> extends DefaultArrayField<T, S, F> {
    renderArrayFieldItem(props: {
        key: string;
        index: number;
        name: string;
        title: string | undefined;
        canAdd: boolean;
        canRemove?: boolean;
        canMoveUp: boolean;
        canMoveDown: boolean;
        itemSchema: S;
        itemData: T[];
        itemUiSchema: UiSchema<T[], S, F>;
        itemIdSchema: IdSchema<T[]>;
        itemErrorSchema?: ErrorSchema<T[]>;
        autofocus?: boolean;
        onBlur: FieldProps<T[], S, F>['onBlur'];
        onFocus: FieldProps<T[], S, F>['onFocus'];
        rawErrors?: string[];
        totalItems: number;
    }) {
        const {
            key,
            index,
            name,
            canAdd,
            canRemove = true,
            canMoveUp,
            canMoveDown,
            itemSchema,
            itemData,
            itemUiSchema,
            itemIdSchema,
            itemErrorSchema,
            autofocus,
            onBlur,
            onFocus,
            rawErrors,
            totalItems,
            title,
        } = props;
        const { disabled, hideError, idPrefix, idSeparator, readonly, uiSchema, registry, formContext } = this.props;
        const {
            fields: { ArraySchemaField, SchemaField },
            globalUiOptions,
        } = registry;
        const ItemSchemaField = ArraySchemaField || SchemaField;
        const { orderable = true, removable = true, copyable = false, grid = false } = getUiOptions<T[], S, F>(uiSchema, globalUiOptions);
        const has: { [key: string]: boolean } = {
            moveUp: orderable && canMoveUp,
            moveDown: orderable && canMoveDown,
            copy: copyable && canAdd,
            remove: removable && canRemove,
            toolbar: false,
        };
        has.toolbar = Object.keys(has).some((key: keyof typeof has) => has[key]);

        return {
            children: (
                <ItemSchemaField
                    name={name}
                    title={title}
                    index={index}
                    schema={itemSchema}
                    uiSchema={{
                        ...itemUiSchema,
                        'ui:options': {
                            ...itemUiSchema,
                            grid
                        }
                    }}
                    formData={itemData}
                    formContext={formContext}
                    errorSchema={itemErrorSchema}
                    idPrefix={idPrefix}
                    idSeparator={idSeparator}
                    idSchema={itemIdSchema}
                    required={this.isItemRequired(itemSchema)}
                    onChange={this.onChangeForIndex(index)}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    registry={registry}
                    disabled={disabled}
                    readonly={readonly}
                    hideError={hideError}
                    autofocus={autofocus}
                    rawErrors={rawErrors}
                />
            ),
            className: 'array-item',
            disabled,
            canAdd,
            hasCopy: has.copy,
            hasToolbar: has.toolbar,
            hasMoveUp: has.moveUp,
            hasMoveDown: has.moveDown,
            hasRemove: has.remove,
            index,
            totalItems,
            key,
            onAddIndexClick: this.onAddIndexClick,
            onCopyIndexClick: this.onCopyIndexClick,
            onDropIndexClick: this.onDropIndexClick,
            onReorderClick: this.onReorderClick,
            readonly,
            registry,
            schema: itemSchema,
            uiSchema: itemUiSchema,
        };
    }
}

export default ArrayField;
