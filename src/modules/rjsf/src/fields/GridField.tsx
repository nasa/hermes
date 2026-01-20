import React, { useContext, useEffect, useMemo } from 'react';
import ObjectField from '@rjsf/core/lib/components/fields/ObjectField';

import { getMessages } from '@gov.nasa.jpl.hermes/vscode/browser/messenger';

import { VSCodeDataGridCell } from '@vscode/webview-ui-toolkit/react';
import { ActionButton } from '../common';
import { ArrayGridRowActionsContext } from '../templates/ArrayFieldItemTemplate';
import { FieldProps, RJSFSchema } from '@rjsf/utils';

const arrayMessenger = getMessages<never, {
    type: (
        "removeItem"
        | "moveUp"
        | "moveDown"
        | "copy"
    );

    id: string;
}>();

class GridFieldBase extends ObjectField {
    onGearIconClicked(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.target.dispatchEvent(new MouseEvent("contextmenu", {
            bubbles: true, clientX: e.clientX, clientY: e.clientY
        }));

        e.stopPropagation();
    }

    render() {
        const {
            schema,
            uiSchema,
            errorSchema,
            idSchema,
            disabled,
            readonly,
            onBlur,
            onFocus,
            formData,
            registry: { fields: { SchemaField } }
        } = this.props;

        const numProps = Object.keys(schema.properties ?? []).length;

        return (<>
            {Object.entries(schema.properties ?? {}).map(([key, value], index) => (
                <VSCodeDataGridCell className='field' grid-column={index + 1} key={key}>
                    <SchemaField
                        name={key}
                        required={this.isRequired(key)}
                        schema={value as RJSFSchema}
                        uiSchema={{
                            ...uiSchema?.[key],
                            'ui:options': {
                                ...uiSchema?.[key]?.['ui:options'],
                                label: false,
                            }
                        }}
                        errorSchema={errorSchema?.[key]}
                        idSchema={(idSchema as any)[key]!}
                        formData={formData[key]}
                        onChange={this.onPropertyChange(key)}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        registry={this.props.registry}
                        disabled={disabled}
                        readonly={readonly}
                    />
                </VSCodeDataGridCell>
            ))}
            <VSCodeDataGridCell className='field' grid-column={numProps + 1}>
                <ActionButton
                    className='grid-row-action-button'
                    title="Actions"
                    icon="settings-gear"
                    data-vscode-context={this.props.contextMenuData}
                    onClick={this.onGearIconClicked.bind(this)}
                />
            </VSCodeDataGridCell>
        </>);
    }
}

export default function GridField(props: FieldProps) {
    const arrayGridRowActions = useContext(ArrayGridRowActionsContext);

    const contextMenuCtx = useMemo(() => ({
        webviewSection: "arrayItem",
        ...props.registry.formContext,
        id: props.idSchema.$id,
        hasCopy: arrayGridRowActions.hasCopy,
        hasMoveDown: arrayGridRowActions.hasMoveDown,
        hasMoveUp: arrayGridRowActions.hasMoveUp,
        hasRemove: arrayGridRowActions.hasRemove,
        preventDefaultContextMenuItems: true
    }), [arrayGridRowActions, props.registry.formContext, props.idSchema.$id]);

    const contextMenuData = useMemo(() => JSON.stringify(contextMenuCtx), [contextMenuCtx]);

    useEffect(() => {
        const listener = arrayMessenger.onDidReceiveMessage((msg) => {
            if (msg.id === props.idSchema.$id
            ) {
                switch (msg.type) {
                    case "removeItem":
                        arrayGridRowActions.onDrop?.();
                        break;
                    case "moveUp":
                        arrayGridRowActions.onMoveUp?.();
                        break;
                    case "moveDown":
                        arrayGridRowActions.onMoveDown?.();
                        break;
                    case "copy":
                        arrayGridRowActions.onCopy?.();
                        break;
                }
            }
        });

        return () => {
            listener.dispose();
        };
    }, []);

    return <GridFieldBase {...props} contextMenuData={contextMenuData} />;
}
