import React, { memo } from 'react';

import { SeriesIcon } from './SeriesIcon';

interface VizLegendSeriesIconProps {
    seriesName: string;
    color?: string;
    gradient?: string;
    readonly?: boolean;
    lineStyle?: { fill?: 'solid' | 'dash' | 'dot' };
}

/**
 * @internal
 */
export const VizLegendSeriesIcon = memo(
    ({ seriesName, color, gradient, readonly, lineStyle }: VizLegendSeriesIconProps) => {
        // Simplified version without color picker functionality
        // In the future, this could be enhanced with color changing capabilities
        return <SeriesIcon color={color} gradient={gradient} lineStyle={lineStyle} />;
    }
);

VizLegendSeriesIcon.displayName = 'VizLegendSeriesIcon';
