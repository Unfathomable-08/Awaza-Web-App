import React from 'react';

interface ScreenWrapperProps {
    children: React.ReactNode;
    bg?: string;
    className?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    bg,
    className = ''
}) => {
    return (
        <div
            className={`flex-1 flex flex-col w-full relative ${className}`}
            style={{
                backgroundColor: bg || 'var(--color-bg)',
                minHeight: '100dvh',
            }}
        >
            {children}
        </div>
    );
};

export default ScreenWrapper;
