import React from 'react';
import { colors } from '../constants/Colors';

interface AvatarProps {
    uri?: string | null;
    size?: number;
    rounded?: number;
    className?: string;
    onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
    uri,
    size = 44,
    className = '',
    onClick
}) => {
    // Correct path for the web project
    const defaultUser = '/src/assets/images/default_user.jpg';
    const source = uri || defaultUser;

    const content = (
        <div
            className={`relative rounded-full overflow-hidden flex items-center justify-center ${className}`}
            style={{
                height: `${size}px`,
                width: `${size}px`,
                backgroundColor: colors.inputBg,
                border: `1.5px solid ${colors.cardBorder}`,
            }}
        >
            <img
                src={source}
                alt="User Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultUser;
                }}
            />
        </div>
    );

    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="p-0 border-none bg-none cursor-pointer outline-none active-scale transition-transform"
            >
                {content}
            </button>
        );
    }

    return content;
};

export default Avatar;
