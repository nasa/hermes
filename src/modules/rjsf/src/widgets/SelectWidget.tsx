import React, { useCallback } from 'react';
import * as rjsf from "@rjsf/utils";

import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';

export function SelectWidget({
    id,
    options,
    required,
    disabled,
    readonly,
    value,
    multiple,
    onChange,
    rawErrors = [],
}: rjsf.WidgetProps) {
    const { enumOptions } = options;

    const onChangeCb = useCallback((
        event: React.FocusEvent | React.ChangeEvent | any
    ) => {
        if (multiple) {
            onChange([].slice
                .call(event.target.options as any)
                .filter((o: any) => o.selected)
                .map((o: any) => o.value));
        } else {
            return onChange(event.target.value);
        }
    }, [onChange, multiple]);

    return (
        <VSCodeDropdown
            id={id}
            name={id}
            value={value}
            required={required}
            multiple={multiple}
            disabled={disabled || readonly}
            className={rawErrors.length > 0 ? "is-invalid" : ""}
            onChange={onChangeCb}
        >
            {!value && <VSCodeOption />}
            {enumOptions?.map(({ label, value }, i: number) =>
                <VSCodeOption value={value} key={i}>{label}</VSCodeOption>
            )}
        </VSCodeDropdown>
    );
};
