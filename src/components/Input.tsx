/**
 * @file Input.tsx
 * @description Styled text input wrapper with an optional leading icon.
 *
 * Features:
 *  - Focus glow: border shifts to primary colour when the field is focused
 *  - Icon slot: any Lucide icon can be passed; it is auto-sized to 18 px
 *  - Forwards the native `onChange` value string (not the DOM event) for
 *    simpler usage: `onChange={(val) => setEmail(val)}`
 */

import React from 'react';

/** Props for the Input component */
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    /** Lucide (or any) icon element to show on the left of the input */
    icon?: React.ReactNode;
    /** Extra class names for the outer container div */
    containerClassName?: string;
    /** Ref forwarded to the underlying `<input>` */
    inputRef?: React.RefObject<HTMLInputElement>;
    /**
     * Change handler — receives the **string value** directly
     * (not the DOM event) for ergonomic usage.
     */
    onChange?: (value: string) => void;
}

/**
 * Input
 *
 * Renders a pill-shaped container housing an optional icon and the native
 * `<input>` element.  Background, caret, and focus-ring colours are driven
 * entirely by CSS custom properties — no inline style props.
 */
const Input: React.FC<InputProps> = ({
    icon,
    containerClassName = '',
    inputRef,
    className = '',
    onChange,
    ...props
}) => {
    return (
        <div
            className={`
                flex flex-row items-center
                py-3 px-4 gap-3 rounded-xl
                bg-input border border-transparent
                transition-all duration-200
                focus-within:border-primary-30
                focus-within:bg-white focus-within:shadow-soft
                ${containerClassName}
            `}
        >
            {/* ── Leading icon (auto-cloned to enforce 18 px size) ── */}
            {icon && (
                <div className="flex items-center justify-center shrink-0 opacity-40 text-app">
                    {React.cloneElement(icon as React.ReactElement, { size: 18 } as object)}
                </div>
            )}

            {/* ── Native input element ── */}
            <input
                ref={inputRef}
                className={`
                    flex-1 h-full bg-transparent outline-none
                    text-[15px] font-medium text-app caret-primary
                    placeholder:font-normal placeholder:text-muted
                    ${className}
                `}
                onChange={(e) => onChange?.(e.target.value)}
                {...props}
            />
        </div>
    );
};

export default Input;
