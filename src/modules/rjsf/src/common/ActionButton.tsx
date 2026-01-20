import React from "react";

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    icon: string;
    disabled?: boolean;
};

export const ActionButton = React.forwardRef<
    HTMLButtonElement, ActionButtonProps
>((props, ref) => {
    const { className, title, icon, disabled } = props;

    return (
        disabled ? null : <button
            {...props}
            ref={ref}
            className={`${className ?? ''} action-button codicon codicon-${icon}`}
            aria-label={title}
        />
    );
});
