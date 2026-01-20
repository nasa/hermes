import React, { forwardRef } from "react";

type DivProps = React.HTMLProps<HTMLDivElement>;

export const HStack = forwardRef<HTMLDivElement, DivProps>(({ style, children, ...props }, ref) => (
    <div
        ref={ref}
        {...props}
        style={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "row"
        }}>
        {children}
    </div>
));

export const VStack = forwardRef<HTMLDivElement, DivProps>(({ style, children, ...props }, ref) => (
    <div
        ref={ref}
        {...props}
        style={{
            flex: 1,
            width: "100%",
            display: "flex",
            gap: "3px",
            flexDirection: "column"
        }}>
        {children}
    </div>
));
