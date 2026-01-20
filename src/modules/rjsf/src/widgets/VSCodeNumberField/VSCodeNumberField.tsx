import {
    provideReactWrapper,
    ReactEvents,
} from "@microsoft/fast-react-wrapper";
import React from "react";
import { provideVSCodeDesignSystem } from "@vscode/webview-ui-toolkit/dist/vscode-design-system";
import { vsCodeNumberField, NumberField } from "./numberField";
const { wrap } = provideReactWrapper(React, provideVSCodeDesignSystem());

// @ts-expect-error Extends can't be explicitely merged
interface VSCodeNumberFieldProps
    extends Partial<NumberField>, ReactEvents<{
        onChange: unknown;
        onInput: unknown;
    }>,
    React.HTMLAttributes<HTMLElement> {
    style?: React.CSSProperties | undefined;
}

/**
 * VS Code Number Field React component.
 *
 * @public
 */
// @ts-expect-error Children types don't overlap
export const VSCodeNumberField: React.ComponentType<VSCodeNumberFieldProps> =
    wrap(vsCodeNumberField(), {
        name: "vscode-number-field",
        events: {
            onChange: "change",
            onInput: "input",
        },
    });
