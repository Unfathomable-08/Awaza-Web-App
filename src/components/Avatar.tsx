import React from 'react';
import { colors } from '../constants/Colors';

interface AvatarProps {
    uri?: string;
    size?: number;
    rounded?: number;
    className?: string;
    onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
    uri,
    size = 44, // Default size in pixels
    rounded = 22,
    className = '',
    onClick
}) => {
    const defaultUser = '/src/assets/images/default_user.jpg';
    const source = uri || defaultUser;

    const content = (
        <img
            src={source}
            alt="User Avatar"
            className={`object-cover ${className}`}
            style={{
                height: `${size}px`,
                width: `${size}px`,
                borderRadius: `${rounded}px`,
                border: `1px solid ${colors.border}`,
                backgroundColor: '#eee'
            }}
            onError={(e) => {
                (e.target as HTMLImageElement).src = defaultUser;
            }}
        />
    );

    if (onClick) {
        return (
            <button onClick={onClick} className="p-0 border-none bg-none cursor-pointer outline-none">
                {content}
            </button>
        );
    }

    return content;
};

export default Avatar;
