import { useCallback } from 'react';
import * as React from 'react';

import { VizLegendSeriesIcon } from './VizLegendSeriesIcon';
import { VizLegendItem } from './types';

// Helper function to format display values
function formattedValueToString(value: { text?: string; numeric: number }): string {
    return value.text ?? String(value.numeric);
}

export interface Props {
    key?: React.Key;
    item: VizLegendItem;
    className?: string;
    onLabelClick?: (item: VizLegendItem, event: React.MouseEvent<HTMLButtonElement>) => void;
    onLabelMouseOver?: (
        item: VizLegendItem,
        event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
    ) => void;
    onLabelMouseOut?: (
        item: VizLegendItem,
        event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
    ) => void;
    readonly?: boolean;
}

/**
 * @internal
 */
export const LegendTableItem = ({
    item,
    onLabelClick,
    onLabelMouseOver,
    onLabelMouseOut,
    className,
    readonly,
}: Props) => {
    const onMouseOver = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FocusEvent<HTMLButtonElement>) => {
            if (onLabelMouseOver) {
                onLabelMouseOver(item, event);
            }
        },
        [item, onLabelMouseOver]
    );

    const onMouseOut = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FocusEvent<HTMLButtonElement>) => {
            if (onLabelMouseOut) {
                onLabelMouseOut(item, event);
            }
        },
        [item, onLabelMouseOut]
    );

    const onClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (onLabelClick) {
                onLabelClick(item, event);
            }
        },
        [item, onLabelClick]
    );

    const rowClassName = `legend-row ${item.disabled ? 'disabled' : ''} ${className ?? ''}`.trim();

    return (
        <tr className={rowClassName}>
            <td>
                <span className="legend-item-wrapper">
                    <VizLegendSeriesIcon
                        color={item.color}
                        seriesName={item.fieldName ?? item.label}
                        readonly={readonly}
                        lineStyle={item.lineStyle}
                    />
                    <button
                        disabled={readonly}
                        type="button"
                        title={item.label}
                        onBlur={onMouseOut}
                        onFocus={onMouseOver}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        onClick={!readonly ? onClick : undefined}
                        className={`legend-label ${item.disabled ? 'legend-label-disabled' : ''}`}
                    >
                        {item.label}{' '}
                        {item.yAxis === 2 && <span className="legend-y-axis-label">(right y-axis)</span>}
                    </button>
                </span>
            </td>
            {item.getDisplayValues &&
                item.getDisplayValues().map((stat, index) => {
                    return (
                        <td className="legend-value" key={`${stat.title}-${index}`}>
                            {formattedValueToString(stat)}
                        </td>
                    );
                })}
        </tr>
    );
};

LegendTableItem.displayName = 'LegendTableItem';
