/**
 * @file Header.tsx
 * @description Top navigation bar used on every page.
 *
 * Layout (3-slot):
 *   [back button | center title/element | right element]
 *
 * The header is sticky and uses glassmorphism when not transparent.
 */

import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/** Props for the Header component */
interface HeaderProps {
    /** Page title shown in the centre slot (ignored when centerElement is provided) */
    title?: string;
    /** Custom JSX to render in the centre slot instead of title text */
    centerElement?: React.ReactNode;
    /** Whether to show the back-chevron in the left slot. Defaults to true. */
    showBackButton?: boolean;
    /** Custom JSX to render in the right slot (e.g., icon buttons) */
    rightElement?: React.ReactNode;
    /** When true the header has no background (useful over hero images) */
    transparent?: boolean;
}

/**
 * Header
 *
 * Renders a 56 px sticky top bar with three fixed-width slots.
 * Uses the `.glass` utility class for the frosted-glass background.
 */
const Header: React.FC<HeaderProps> = ({
    title = '',
    centerElement,
    showBackButton = true,
    rightElement,
    transparent = false,
}) => {
    const navigate = useNavigate();

    return (
        <header
            className={`
                sticky top-0 z-50
                flex flex-row items-center justify-between
                h-14 w-full px-2
                ${transparent ? 'bg-transparent' : 'glass border-b border-gray-100/60'}
            `}
        >
            {/* ── Left slot: back button ── */}
            <div className="flex items-center w-11">
                {showBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="
                            w-9 h-9 flex items-center justify-center
                            rounded-full hover:bg-black/5
                            active:scale-90 transition-all
                        "
                    >
                        <ChevronLeft
                            size={22}
                            strokeWidth={2.5}
                            className="text-app"
                        />
                    </button>
                )}
            </div>

            {/* ── Centre slot: title text or custom element ── */}
            <div className="flex-1 flex justify-center overflow-hidden px-1">
                {centerElement ?? (
                    title
                        ? (
                            <h1 className="
                                text-[17px] font-outfit font-bold
                                tracking-tight truncate text-app
                            ">
                                {title}
                            </h1>
                        )
                        : null
                )}
            </div>

            {/* ── Right slot: icon button(s) etc. ── */}
            <div className="flex items-center justify-end w-11">
                {rightElement}
            </div>
        </header>
    );
};

export default Header;
