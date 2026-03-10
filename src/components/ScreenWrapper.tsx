/**
 * @file ScreenWrapper.tsx
 * @description Full-height page wrapper that sets the base background colour.
 *
 * Every page should be wrapped in this component so they all share the same
 * background default and `flex-col` layout structure.  The optional `bg` prop
 * accepts any CSS colour string (e.g. `"transparent"` or `"#fff"`) for the
 * rare pages that need a non-default background.
 */

import React from 'react';

/** Props for the ScreenWrapper component */
interface ScreenWrapperProps {
    /** Child components/pages to render inside the wrapper */
    children: React.ReactNode;
    /**
     * Override the background colour.
     * Defaults to `var(--color-bg)` (white) via the `.bg-app` Tailwind class.
     */
    bg?: string;
    /** Additional Tailwind class names to merge onto the wrapper div */
    className?: string;
}

/**
 * ScreenWrapper
 *
 * Provides the full-height flex-column container that pages are built inside.
 * Uses `min-h-svh` (smallest viewport height) for correct behaviour on mobile
 * browsers where the address bar can shrink/expand.
 */
const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    bg,
    className = '',
}) => {
    return (
        <div
            className={`flex-1 flex flex-col w-full relative min-h-svh bg-app ${className}`}
            /* Only use an inline style when a custom colour override is provided */
            style={bg ? { backgroundColor: bg } : undefined}
        >
            {children}
        </div>
    );
};

export default ScreenWrapper;
