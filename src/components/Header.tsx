import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/Colors';

interface HeaderProps {
    title?: string;
    centerElement?: React.ReactNode;
    showBackButton?: boolean;
    rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title = '', centerElement, showBackButton = true, rightElement }) => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md flex flex-row items-center justify-between h-14 px-4 w-full border-b border-gray-100">
            <div className="flex items-center w-10">
                {showBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-black/5 active:bg-black/10 rounded-full transition-all"
                    >
                        <ChevronLeft size={24} color={colors.text} />
                    </button>
                )}
            </div>

            <div className="flex-1 flex justify-center overflow-hidden px-2">
                {centerElement ? centerElement : (
                    <h1
                        className="text-xl font-bold truncate"
                        style={{ color: colors.text }}
                    >
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center justify-end w-10">
                {rightElement}
            </div>
        </header>
    );
};

export default Header;
