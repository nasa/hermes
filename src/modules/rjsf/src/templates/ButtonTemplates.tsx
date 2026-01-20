import React from "react";
import * as rjsf from "@rjsf/utils";

import { ActionButton } from "../common/ActionButton";

export function AddButton({ icon, iconType, uiSchema, registry, ...props }: rjsf.IconButtonProps) {
    return (
        <ActionButton
            {...props}
            title='Add Item'
            icon='add'
        />
    );
}

export function MoveDownButton({ icon, iconType, uiSchema, registry, ...props }: rjsf.IconButtonProps) {
    return (
        <ActionButton
            {...props}
            title='Move Down'
            icon='arrow-small-down'
        />
    );
}

export function MoveUpButton({ icon, iconType, uiSchema, registry, ...props }: rjsf.IconButtonProps) {
    return (
        <ActionButton
            {...props}
            title='Move Up'
            icon='arrow-small-up'
        />
    );
}

export function RemoveButton({ icon, iconType, uiSchema, registry, ...props }: rjsf.IconButtonProps) {
    return (
        <ActionButton
            {...props}
            title='Remove'
            icon='trash'
        />
    );
}
