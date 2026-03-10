/**
 * @file Avatar.tsx
 * @description Rounded user avatar image with a fallback to a default image.
 *
 * When `onClick` is provided the avatar is wrapped in a `<button>` for
 * proper keyboard/accessibility support.  Border-radius is proportional to
 * the size (38% of height) to give a consistent "squircle" look.
 */

import React from 'react';

/** Props for the Avatar component */
interface AvatarProps {
    /** Remote or local image URL.  Falls back to `/src/assets/images/default_user.jpg` */
    uri?: string | null;
    /** Pixel size for both width and height (square). Defaults to 44. */
    size?: number;
    /** Extra class names applied to the image container */
    className?: string;
    /** When provided, wraps the avatar in a pressable `<button>` */
    onClick?: () => void;
}

/** Path to the bundled default avatar image */
const DEFAULT_AVATAR = '/src/assets/images/default_user.jpg';

/**
 * Avatar
 *
 * Renders a square image clipped to a proportional border-radius.
 * Dynamic border-radius (38 % of size) requires an inline style here
 * because Tailwind can't generate arbitrary pixel radii at build time.
 */
const Avatar: React.FC<AvatarProps> = ({
    uri,
    size = 44,
    className = '',
    onClick,
}) => {
    const src = uri || DEFAULT_AVATAR;

    /** Core image container — shared by both the plain and button variants */
    const imageBox = (
        <div
            className={`
                relative overflow-hidden shrink-0
                flex items-center justify-center
                bg-input border border-card rounded-full
                ${className}
            `}
            style={{
                width: size,
                height: size,
            }}
        >
            <img
                src={src}
                alt="User avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                    /* Swap to the default avatar if the URL fails to load */
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                }}
            />
        </div>
    );

    /* Wrap in a button when a click handler is provided */
    if (onClick) {
        return (
            <button
                onClick={onClick}
                aria-label="Open user profile"
                className="
                    p-0 border-none bg-transparent
                    cursor-pointer outline-none
                    active-scale transition-transform shrink-0 rounded-full
                "
            >
                {imageBox}
            </button>
        );
    }

    return imageBox;
};

export default Avatar;
