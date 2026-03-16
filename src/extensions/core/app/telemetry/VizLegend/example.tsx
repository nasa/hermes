/**
 * Example showing how to use VizLegend components in your plot view.
 *
 * This demonstrates how to integrate the legend table with your telemetry plot.
 */

import React from 'react';
import { VizLegendTable, VizLegendItem } from './index';

// Example: Creating legend items from your plotInfo and plotData
function createLegendItemsFromPlotData(
    plotInfo: Record<string, { component: string; name: string }>,
    plotData: Record<string, any>,
    palette: string[]
): VizLegendItem[] {
    const items: VizLegendItem[] = [];
    let index = 0;

    for (const [channelKey, info] of Object.entries(plotInfo)) {
        if (index >= palette.length) {
            break;
        }

        const data = plotData[channelKey];
        const label = `${info.component}.${info.name}`;

        // Get the latest value if available
        const getDisplayValues = data?.valueNum ? () => {
            const values = data.valueNum;
            const latest = values[values.length - 1];
            return [
                {
                    title: 'Last',
                    numeric: latest,
                    text: latest?.toFixed(2),
                },
                {
                    title: 'Min',
                    numeric: Math.min(...values),
                    text: Math.min(...values).toFixed(2),
                },
                {
                    title: 'Max',
                    numeric: Math.max(...values),
                    text: Math.max(...values).toFixed(2),
                },
            ];
        } : undefined;

        items.push({
            label,
            color: palette[index],
            yAxis: 1,
            disabled: false,
            fieldName: channelKey,
            getDisplayValues,
            getItemKey: () => channelKey,
        });

        index++;
    }

    return items;
}

// Example: Using the VizLegendTable component
export function ExampleLegendUsage() {
    // Mock data for demonstration
    const legendItems: VizLegendItem[] = [
        {
            label: 'FSW.Temperature',
            color: '#7EB26D',
            yAxis: 1,
            fieldName: 'temp',
            getDisplayValues: () => [
                { title: 'Last', numeric: 23.5, text: '23.50' },
                { title: 'Min', numeric: 20.0, text: '20.00' },
                { title: 'Max', numeric: 25.0, text: '25.00' },
            ],
        },
        {
            label: 'FSW.Pressure',
            color: '#EAB839',
            yAxis: 1,
            fieldName: 'pressure',
            getDisplayValues: () => [
                { title: 'Last', numeric: 101.3, text: '101.30' },
                { title: 'Min', numeric: 100.0, text: '100.00' },
                { title: 'Max', numeric: 102.0, text: '102.00' },
            ],
        },
    ];

    const handleLabelClick = (item: VizLegendItem) => {
        console.log('Clicked:', item.label);
        // You could toggle series visibility here
    };

    const handleLabelMouseOver = (item: VizLegendItem) => {
        console.log('Hover:', item.label);
        // You could highlight the series in the plot
    };

    const handleLabelMouseOut = (item: VizLegendItem) => {
        console.log('Leave:', item.label);
        // You could un-highlight the series
    };

    return (
        <div style={{ padding: '10px' }}>
            <h3>Plot Legend</h3>
            <VizLegendTable
                items={legendItems}
                onLabelClick={handleLabelClick}
                onLabelMouseOver={handleLabelMouseOver}
                onLabelMouseOut={handleLabelMouseOut}
                isSortable={true}
                sortBy="Name"
                sortDesc={false}
            />
        </div>
    );
}

/**
 * Integration into your TelemetryPlot component:
 *
 * 1. Import the components:
 *    import { VizLegendTable, VizLegendItem } from './VizLegend';
 *
 * 2. Create legend items from your plot data:
 *    const legendItems = useMemo(() =>
 *        createLegendItemsFromPlotData(plotInfo, plotData, palette),
 *        [plotInfo, plotData]
 *    );
 *
 * 3. Add legend to your UI (e.g., below the plot or in a sidebar):
 *    <VizLegendTable
 *        items={legendItems}
 *        onLabelClick={(item) => {
 *            // Toggle series visibility or highlight
 *        }}
 *        isSortable={true}
 *    />
 *
 * Optional: Add line style support
 * You can specify different line styles for each series:
 *    lineStyle: { fill: 'solid' | 'dash' | 'dot' }
 */
