/**
 * @file Button.tsx
 * @description Primary call-to-action button with four visual variants.
 *
 * Variants:
 *  - `primary`   — solid red background (brand CTA)
 *  - `secondary` — solid black background
 *  - `outline`   — transparent with gray border
 *  - `ghost`     — transparent with primary-colored text
 *
 * The button handles loading (spinner) and disabled (opacity) states
 * automatically so callers don't need conditional rendering.
 */

import React from 'react';

/** Supported visual variants of the button */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/** Props for the Button component */
interface ButtonProps {
    /** Extra class names for the outer button element */
    className?: string;
    /** Extra class names for the inner text span */
    textClassName?: string;
    /** Button label text */
    title?: string;
    /** Click handler (not called when disabled or loading) */
    onClick?: () => void;
    /** Shows a spinner and blocks interaction */
    loading?: boolean;
    /** Adds a premium drop-shadow */
    hasShadow?: boolean;
    /** Visually and functionally disables the button */
    disabled?: boolean;
    /** Controls the colour/fill style */
    variant?: ButtonVariant;
}

/** Maps each variant to its Tailwind class string */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:   'bg-primary text-white border-transparent',
    secondary: 'bg-black   text-white border-transparent',
    outline:   'bg-transparent text-app border border-app',
    ghost:     'bg-transparent text-primary border-transparent',
};

/**
 * Button
 *
 * Full-width by default (override with `className="!w-auto"`).
 * Height is 48 px (h-12) for touch-friendly tap targets.
 */
const Button: React.FC<ButtonProps> = ({
    className = '',
    textClassName = '',
    title = '',
    onClick = () => {},
    loading = false,
    hasShadow = false,
    disabled = false,
    variant = 'primary',
}) => {
    const isInert = disabled || loading;

    return (
        <button
            onClick={!isInert ? onClick : undefined}
            disabled={isInert}
            className={`
                flex items-center justify-center
                rounded-xl h-12 w-full px-6
                font-outfit font-bold text-[16px] tracking-wide
                transition-all border
                ${VARIANT_CLASSES[variant]}
                ${hasShadow ? 'shadow-premium' : ''}
                ${isInert ? 'opacity-40 cursor-not-allowed' : 'active-scale btn-hover'}
                ${className}
            `}
        >
            {loading ? (
                /* Spinner inherits text colour so it matches the variant */
                <div className="
                    w-5 h-5 rounded-full border-2
                    border-current border-t-transparent
                    animate-spin
                " />
            ) : (
                <span className={textClassName}>{title}</span>
            )}
        </button>
    );
};

export default Button;
