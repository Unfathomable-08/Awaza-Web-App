import React from 'react';
import { colors } from '../constants/Colors';

interface ScreenWrapperProps {
    children: React.ReactNode;
    bg?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, bg = colors.background }) => {
    return (
        <div
            className="flex-1 flex flex-col w-full relative h-full"
            style={{ backgroundColor: bg }}
        >
            {children}
        </div>
    );
};

export default ScreenWrapper;
