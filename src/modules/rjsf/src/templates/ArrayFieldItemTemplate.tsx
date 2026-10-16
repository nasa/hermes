import React, { createContext, useCallback } from 'react';
import * as rjsf from "@rjsf/utils";
import { VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';

export type ArrayGridRowActionsContextProps = Partial<Pick<rjsf.ArrayFieldTemplateItemType, (
    'hasCopy' |
    'hasMoveDown' |
    'hasMoveUp' |
    'hasRemove' |
    'index'
)> & {
    onCopy: () => void;
    onDrop: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}>;

const nop = () => { throw new Error("No context"); };

export const ArrayGridRowActionsContext = createContext<ArrayGridRowActionsContextProps>({
    hasCopy: false,
    hasMoveDown: false,
    hasMoveUp: false,
    hasRemove: false,
    index: -1,
    onCopy: nop,
    onDrop: nop,
    onMoveUp: nop,
    onMoveDown: nop
});

export default function ArrayFieldItemTemplate({
    children,
    grid,
    hasCopy,
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    index,
    registry,
    uiSchema,
    onCopyIndexClick,
    onDropIndexClick,
    onReorderClick
}: rjsf.ArrayFieldTemplateItemType & { grid?: boolean }) {
    const onCopy = useCallback(() => {
        onCopyIndexClick(index)();
    }, [onCopyIndexClick, index]);

    const onMoveDown = useCallback(() => {
        onReorderClick(index, index + 1)();
    }, [onReorderClick, index]);

    const onMoveUp = useCallback(() => {
        onReorderClick(index, index - 1)();
    }, [onReorderClick, index]);

    const onDrop = useCallback(() => {
        onDropIndexClick(index)();
    }, [onDropIndexClick, index]);

    const {
        ButtonTemplates: {
            MoveUpButton,
            MoveDownButton,
            RemoveButton,
        }
    } = registry.templates;

    if (grid) {
        return (
            <VSCodeDataGridRow key={index}>
                <ArrayGridRowActionsContext.Provider value={{
                    hasCopy,
                    hasMoveDown,
                    hasMoveUp,
                    hasRemove,
                    index,
                    onCopy,
                    onMoveDown,
                    onMoveUp,
                    onDrop,
                }}>
                    {children}
                </ArrayGridRowActionsContext.Provider>
            </VSCodeDataGridRow>
        );
    } else {
        return (
            <div style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "calc(var(--design-unit) * 1px)"
            }}>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                    {children}
                </div>
                <div style={{
                    display: "flex",
                    flexShrink: 0
                }}>
                    {hasMoveUp && <MoveUpButton onClick={onMoveUp} registry={registry} uiSchema={uiSchema} />}
                    {hasMoveDown && <MoveDownButton onClick={onMoveDown} registry={registry} uiSchema={uiSchema} />}
                    {hasRemove && <RemoveButton onClick={onDrop} registry={registry} uiSchema={uiSchema} />}
                </div>
            </div>
        );
    }
}
