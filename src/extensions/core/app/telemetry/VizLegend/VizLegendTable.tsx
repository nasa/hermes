import React, { type JSX } from 'react';

import { LegendTableItem } from './VizLegendTableItem';
import { VizLegendTableProps } from './types';

// Helper to conditionally join classNames
function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

const nameSortKey = 'Name';
const naturalCompare = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;

export const VizLegendTable = ({
    items,
    sortBy: sortKey,
    sortDesc,
    itemRenderer,
    onToggleSort,
    onLabelClick,
    onLabelMouseOver,
    onLabelMouseOut,
    isSortable,
    className,
}: VizLegendTableProps): JSX.Element => {
    const header: Record<string, string> = {
        [nameSortKey]: '',
    };

    for (const item of items) {
        if (item.getDisplayValues) {
            for (const displayValue of item.getDisplayValues()) {
                header[displayValue.title ?? '?'] = displayValue.title ?? '';
            }
        }
    }

    if (sortKey != null) {
        const sortMult = sortDesc ? -1 : 1;
        items.sort((a, b) => {
            return sortMult * naturalCompare(a.label, b.label);
        });
    }

    if (!itemRenderer) {
        itemRenderer = (item, index) => (
            <LegendTableItem
                key={`${item.label}-${index}`}
                item={item}
                onLabelClick={onLabelClick}
                onLabelMouseOver={onLabelMouseOver}
                onLabelMouseOut={onLabelMouseOut}
            />
        );
    }

    return (
        <table className={classNames('legend-table', className)}>
            <thead>
                <tr>
                    {Object.keys(header).map((columnTitle) => (
                        <th
                            title={header[columnTitle]}
                            key={columnTitle}
                            className={classNames(
                                'legend-table-header',
                                onToggleSort && 'legend-table-header-sortable',
                                isSortable && 'legend-table-name-header',
                                sortKey === columnTitle && 'legend-table-with-icon',
                                !isSortable && 'sr-only'
                            )}
                            onClick={() => {
                                if (onToggleSort && isSortable) {
                                    onToggleSort(columnTitle);
                                }
                            }}
                        >
                            {columnTitle}
                            {sortKey === columnTitle && <span>{sortDesc ? '▼' : '▲'}</span>}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>{items.map(itemRenderer!)}</tbody>
        </table>
    );
};
