import { VSCodeTag } from "@vscode/webview-ui-toolkit/react";
import React from "react";

export interface ActionableItemProps {
    actions: React.ReactElement[];
    title: string;
    tag?: string;
    onTitleDoubleClick?: () => void;
}

export function ActionableItem({
    actions,
    title,
    tag,
    onTitleDoubleClick
}: ActionableItemProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
        }}>
            <div style={{
                display: "flex",
                overflow: "hidden",
                textOverflow: "ellipsis"
            }}>
                <label onDoubleClick={onTitleDoubleClick} className="connection-profile-header">
                    {title}
                </label>
            </div>
            <div style={{ flexGrow: 1 }} />
            {tag && <VSCodeTag style={{ marginTop: '3px', marginRight: '6px' }}>{tag}</VSCodeTag>}
            {actions}
        </div>
    );
}
