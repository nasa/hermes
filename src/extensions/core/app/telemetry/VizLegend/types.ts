import { JSX } from 'react';

export interface DisplayValue {
    text?: string;
    numeric: number;
    color?: string;
    title?: string;
}

export interface VizLegendItem {
    getItemKey?: () => string;
    label: string;
    color?: string;
    gradient?: string;
    yAxis: number;
    disabled?: boolean;
    fieldName?: string;
    lineStyle?: { fill?: 'solid' | 'dash' | 'dot' };
    getDisplayValues?: () => DisplayValue[];
}

export interface VizLegendBaseProps {
    items: Array<VizLegendItem>;
    onLabelClick?: (item: VizLegendItem, event: React.MouseEvent<HTMLButtonElement>) => void;
    itemRenderer?: (item: VizLegendItem, index: number) => JSX.Element;
    onLabelMouseOver?: (
        item: VizLegendItem,
        event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
    ) => void;
    onLabelMouseOut?: (
        item: VizLegendItem,
        event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
    ) => void;
}

export interface VizLegendTableProps extends VizLegendBaseProps {
    sortBy?: string;
    sortDesc?: boolean;
    onToggleSort?: (sortBy: string) => void;
    isSortable?: boolean;
    className?: string;
}
