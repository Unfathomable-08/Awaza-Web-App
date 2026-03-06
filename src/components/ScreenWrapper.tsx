import React from 'react';
import { colors } from '../constants/Colors';

interface ScreenWrapperProps {
    children: React.ReactNode;
    bg?: string;
    className?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    bg = colors.background,
    className = ''
}) => {
    return (
        <div
            className={`flex-1 flex flex-col w-full relative min-h-svh ${className}`}
            style={{ backgroundColor: bg }}
        >
            {children}
        </div>
    );
};

export default ScreenWrapper;
