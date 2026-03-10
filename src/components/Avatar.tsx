import React from 'react';

interface AvatarProps {
    uri?: string | null;
    size?: number;
    className?: string;
    onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
    uri,
    size = 44,
    className = '',
    onClick
}) => {
    const defaultUser = '/src/assets/images/default_user.jpg';
    const source = uri || defaultUser;

    const content = (
        <div
            className={`relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${className}`}
            style={{
                height: `${size}px`,
                width: `${size}px`,
                backgroundColor: 'var(--color-input-bg)',
                border: '1.5px solid var(--color-card-border)',
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
                className="p-0 border-none bg-transparent cursor-pointer outline-none active-scale transition-transform flex-shrink-0"
                style={{ borderRadius: `${Math.round(size * 0.38) + 2}px` }}
            >
                {content}
            </button>
        );
    }

    return content;
};

export default Avatar;
