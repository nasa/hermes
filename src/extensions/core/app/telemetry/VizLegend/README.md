# VizLegend Components

This directory contains the VizLegend components adapted from Grafana for displaying plot legends in the Hermes telemetry system.

## Components

### VizLegendTable
The main legend table component that displays a list of series with their colors and optional statistics.

**Props:**
- `items`: Array of `VizLegendItem` objects to display
- `className?`: Optional CSS class name
- `onLabelClick?`: Callback when a legend label is clicked
- `onLabelMouseOver?`: Callback when hovering over a label
- `onLabelMouseOut?`: Callback when mouse leaves a label
- `isSortable?`: Whether to show sortable header
- `sortBy?`: Current sort column key
- `sortDesc?`: Whether to sort descending
- `onToggleSort?`: Callback when sort is toggled

### VizLegendItem (Type)
Represents a single series in the legend.

**Properties:**
- `label`: Display name for the series
- `color?`: Hex color code (e.g., '#7EB26D')
- `gradient?`: CSS gradient string
- `yAxis`: Y-axis number (1 or 2 for right axis)
- `disabled?`: Whether the series is disabled
- `fieldName?`: Internal field/channel name
- `lineStyle?`: Line style configuration `{ fill: 'solid' | 'dash' | 'dot' }`
- `getDisplayValues?`: Function returning statistics to display (Last, Min, Max, etc.)
- `getItemKey?`: Function returning unique key for the item

### SeriesIcon
Small colored icon representing a series with optional line style patterns.

### VizLegendSeriesIcon
Wrapper around SeriesIcon that can be extended with color picker functionality.

## Styling

All styles are defined in `plot.css` with CSS classes:
- `.legend-table`: Main table container
- `.legend-table-header`: Table header cells
- `.legend-row`: Individual legend rows
- `.legend-label`: Series label button
- `.legend-value`: Statistics value cells
- `.series-icon`: Small colored series indicator

## Usage Example

```tsx
import { VizLegendTable, VizLegendItem } from './VizLegend';

const legendItems: VizLegendItem[] = [
    {
        label: 'FSW.Temperature',
        color: '#7EB26D',
        yAxis: 1,
        fieldName: 'temp',
        lineStyle: { fill: 'solid' },
        getDisplayValues: () => [
            { title: 'Last', numeric: 23.5, text: '23.50' },
            { title: 'Min', numeric: 20.0, text: '20.00' },
            { title: 'Max', numeric: 25.0, text: '25.00' },
        ],
    },
];

<VizLegendTable
    items={legendItems}
    onLabelClick={(item) => console.log('Clicked:', item.label)}
    isSortable={true}
/>
```

## Integration with Plot

To integrate the legend into your plot view:

1. Create legend items from your telemetry data
2. Pass series colors, names, and statistics
3. Handle click events to toggle series visibility
4. Handle hover events to highlight series in the plot

See `example.tsx` for a complete integration example.

## Files

- `types.ts`: TypeScript type definitions
- `VizLegendTable.tsx`: Main table component
- `VizLegendTableItem.tsx`: Individual row component
- `SeriesIcon.tsx`: Colored icon component
- `VizLegendSeriesIcon.tsx`: Series icon wrapper
- `index.ts`: Public exports
- `example.tsx`: Usage examples
- `README.md`: This file

## Differences from Grafana

This implementation is simplified compared to Grafana:
- No emotion CSS-in-JS (uses plain CSS classes with VSCode theme variables)
- No color picker functionality (can be added later)
- No dependency on Grafana theming system
- Simplified display value formatting
- No internationalization (i18n) dependencies
