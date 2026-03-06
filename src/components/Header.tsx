import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../constants/Colors';

interface HeaderProps {
    title?: string;
    centerElement?: React.ReactNode;
    showBackButton?: boolean;
    rightElement?: React.ReactNode;
    transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    title = '',
    centerElement,
    showBackButton = true,
    rightElement,
    transparent = false
}) => {
    const navigate = useNavigate();

    return (
        <header className={`
            sticky top-0 z-50 flex flex-row items-center justify-between h-16 w-full
            ${transparent ? 'bg-transparent' : 'glass border-b border-gray-100/50'}
        `}>
            <div className="flex items-center w-12">
                {showBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} color={colors.text} />
                    </button>
                )}
            </div>

            <div className="flex-1 flex justify-center overflow-hidden px-2">
                {centerElement ? centerElement : (
                    <h1
                        className="text-[18px] font-outfit font-bold tracking-tight truncate px-4"
                        style={{ color: colors.text }}
                    >
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center justify-end px-1 pt-1 w-12">
                {rightElement}
            </div>
        </header>
    );
};

export default Header;
