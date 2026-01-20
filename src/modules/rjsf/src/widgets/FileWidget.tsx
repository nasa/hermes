import React from "react";

import * as rjsf from "@rjsf/utils";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

export function FileWidget(props: rjsf.WidgetProps) {
    const { options } = props;
    // const { workspaceRelative, revealInExplorer, isFolder, filters } = options;
    const { revealInExplorer } = options;

    // const previewCb = useCallback(() => {
    //     messages.send({
    //         type: revealInExplorer ? 'explorer.reveal' : 'editor.open',
    //         value: props.value,
    //         workspaceRelative: workspaceRelative as boolean
    //     });
    // }, [props.value]);

    // Select a file from the dialog
    // const openCb = useCallback(() => {
    //     messages.request({
    //         type: 'open',
    //         isFolder: isFolder as boolean,
    //         filters: filters as {[name: string]: string[] },
    //         multi: false,
    //         workspaceRelative: workspaceRelative as boolean
    //     }).then(data => props.onChange(data));
    // }, [props.value]);

    return (
        <div className="file-field select">
            <VSCodeTextField
                value={props.value || ""}
                id={props.id}
                className={props.className}
                disabled={props.disabled}
                onChange={(e: any) => props.onChange(e.target.value)}
                onInput={(e: any) => props.onChange(e.target.value)}
                required={props.required}
                placeholder={props.placeholder}>
                {props.title}
            </VSCodeTextField>

            <VSCodeButton title={revealInExplorer ? "Reveal in explorer" : "Open in editor"} appearance="icon" className='second' aria-label="Show" onClick={() => { }}>
                <span className="codicon codicon-preview"></span>
            </VSCodeButton>
            <VSCodeButton title="Find new file" appearance="icon" aria-label="Open" onClick={() => { }}>
                <span className="codicon codicon-folder-opened"></span>
            </VSCodeButton>
        </div>
    );
};