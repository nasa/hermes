import React from "react";

export interface ActionBarProps {
    actions: React.ReactElement<ActionBarProps>[];
}

export function ActionBar({ children, actions }: ActionBarProps & React.PropsWithChildren) {
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
                {children}
            </div>
            <div style={{ flexGrow: 1 }} />
            {actions}
        </div >
    );
}
