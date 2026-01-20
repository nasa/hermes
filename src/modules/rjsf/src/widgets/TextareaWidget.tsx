import React from 'react';
import * as rjsf from "@rjsf/utils";

import { VSCodeTextArea } from '@vscode/webview-ui-toolkit/react';

export function TextareaWidget(props: rjsf.WidgetProps) {
    const _onChange = (e: any) => {
        const value = e.target.value;
        props.onChange(value ?? props.options.emptyValue ?? "");
    };

    return (
        <VSCodeTextArea
            value={props.value ?? ""}
            id={props.id}
            className={props.className}
            disabled={props.disabled}
            onChange={_onChange}
            onInput={_onChange}
            required={props.required}
            placeholder={props.placeholder}
        >
            {props.title}
        </VSCodeTextArea>
    );
};
