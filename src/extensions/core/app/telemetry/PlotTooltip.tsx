import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';

/**
 * Calculate tooltip position ensuring it stays within the window bounds.
 * Default position is to the right and below the cursor.
 */
export function calculateTooltipPosition(
    xPos: number,
    yPos: number,
    tooltipWidth: number,
    tooltipHeight: number,
    xOffset: number,
    yOffset: number,
    windowWidth: number,
    windowHeight: number
): { x: number; y: number } {
    let x = xPos;
    let y = yPos;

    const overflowRight = Math.max(xPos + xOffset + tooltipWidth - (windowWidth - xOffset), 0);
    const overflowLeft = Math.abs(Math.min(xPos - xOffset - tooltipWidth - xOffset, 0));
    const wouldOverflowRight = overflowRight > 0;
    const wouldOverflowLeft = overflowLeft > 0;

    const overflowBelow = Math.max(yPos + yOffset + tooltipHeight - (windowHeight - yOffset), 0);
    const overflowAbove = Math.abs(Math.min(yPos - yOffset - tooltipHeight - yOffset, 0));
    const wouldOverflowBelow = overflowBelow > 0;
    const wouldOverflowAbove = overflowAbove > 0;

    if (wouldOverflowRight && wouldOverflowLeft) {
        x = overflowRight > overflowLeft ? xOffset : windowWidth - xOffset - tooltipWidth;
    } else if (wouldOverflowRight) {
        x = xPos - xOffset - tooltipWidth;
    } else {
        x = xPos + xOffset;
    }

    if (wouldOverflowBelow && wouldOverflowAbove) {
        y = overflowBelow > overflowAbove ? yOffset : windowHeight - yOffset - tooltipHeight;
    } else if (wouldOverflowBelow) {
        y = yPos - yOffset - tooltipHeight;
    } else {
        y = yPos + yOffset;
    }
    return { x, y };
}

interface PlotTooltipContainerProps {
    position: { x: number; y: number };
    offset: { x: number; y: number };
    children: React.ReactNode;
}

/**
 * Container component that positions the tooltip and handles boundary detection
 */
export function PlotTooltipContainer({ position, offset, children }: PlotTooltipContainerProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
    const [placement, setPlacement] = useState({
        x: position.x + offset.x,
        y: position.y + offset.y,
    });

    // Measure tooltip size
    const resizeObserver = useMemo(
        () =>
            new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const width = Math.floor(entry.contentRect.width + 2 * 8); // padding
                    const height = Math.floor(entry.contentRect.height + 2 * 8);
                    if (tooltipSize.width !== width || tooltipSize.height !== height) {
                        setTooltipSize({ width, height });
                    }
                }
            }),
        [tooltipSize]
    );

    useLayoutEffect(() => {
        if (tooltipRef.current) {
            resizeObserver.observe(tooltipRef.current);
        }
        return () => {
            resizeObserver.disconnect();
        };
    }, [resizeObserver]);

    // Calculate position to keep tooltip within window bounds
    useLayoutEffect(() => {
        if (tooltipRef.current && tooltipSize.width > 0 && tooltipSize.height > 0) {
            const { x, y } = calculateTooltipPosition(
                position.x,
                position.y,
                tooltipSize.width,
                tooltipSize.height,
                offset.x,
                offset.y,
                window.innerWidth,
                window.innerHeight
            );

            setPlacement({ x, y });
        }
    }, [position.x, position.y, offset.x, offset.y, tooltipSize]);

    return (
        <div
            ref={tooltipRef}
            className="plot-tooltip-container"
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                transform: `translate(${placement.x}px, ${placement.y}px)`,
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            {children}
        </div>
    );
}

interface SeriesValueProps {
    color: string;
    label: string;
    value: string;
}

function SeriesValue({ color, label, value }: SeriesValueProps) {
    return (
        <div className="tooltip-series-row">
            <div className="tooltip-series-color" style={{ backgroundColor: color }} />
            <div className="tooltip-series-label">{label}</div>
            <div className="tooltip-series-value">{value}</div>
        </div>
    );
}

interface PlotTooltipContentProps {
    timestamp: string;
    series: SeriesValueProps[];
}

/**
 * Displays tooltip content with timestamp and series values
 */
export function PlotTooltipContent({ timestamp, series }: PlotTooltipContentProps) {
    return (
        <div className="plot-tooltip-content">
            <div className="tooltip-timestamp">{timestamp}</div>
            <div className="tooltip-series-list">
                {series.map((s, i) => (
                    <SeriesValue key={i} color={s.color} label={s.label} value={s.value} />
                ))}
            </div>
        </div>
    );
}

interface PlotTooltipProps {
    position: { x: number; y: number };
    offset: { x: number; y: number };
    content: React.ReactNode;
}

/**
 * Main tooltip component that renders in a portal
 */
export function PlotTooltip({ position, offset, content }: PlotTooltipProps) {
    return (
        <div className="plot-tooltip-portal">
            <PlotTooltipContainer position={position} offset={offset}>
                {content}
            </PlotTooltipContainer>
        </div>
    );
}
