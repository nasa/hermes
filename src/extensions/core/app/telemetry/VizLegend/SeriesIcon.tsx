import { CSSProperties } from 'react';
import * as React from 'react';

export interface SeriesIconProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: string;
    gradient?: string;
    lineStyle?: { fill?: 'solid' | 'dash' | 'dot' };
}

export const SeriesIcon = React.memo(
    React.forwardRef<HTMLDivElement, SeriesIconProps>(
        ({ color, className, gradient, lineStyle, ...restProps }, ref) => {
            let customStyle: CSSProperties;

            if (lineStyle?.fill === 'dot' && !gradient && color) {
                // Make a circle bg image and repeat it
                customStyle = {
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${color} 2px, transparent 0)`,
                    backgroundSize: '4px 4px',
                    backgroundRepeat: 'space',
                };
            } else if (lineStyle?.fill === 'dash' && !gradient && color) {
                // Make a rectangle bg image and repeat it
                customStyle = {
                    backgroundImage: `linear-gradient(to right, ${color} 100%, transparent 0%)`,
                    backgroundSize: '6px 4px',
                    backgroundRepeat: 'space',
                };
            } else {
                const background = gradient || color || 'var(--vscode-editor-foreground)';
                customStyle = {
                    background,
                    borderRadius: '2px',
                };
            }

            const classes = ['series-icon', className].filter(Boolean).join(' ');

            return (
                <div
                    data-testid="series-icon"
                    ref={ref}
                    className={classes}
                    style={customStyle}
                    {...restProps}
                />
            );
        }
    )
);

SeriesIcon.displayName = 'SeriesIcon';
