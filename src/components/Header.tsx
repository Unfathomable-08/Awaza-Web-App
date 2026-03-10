import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
        <header
            className={`
                sticky top-0 z-50 flex flex-row items-center justify-between
                h-14 w-full px-2
                ${transparent ? 'bg-transparent' : 'glass border-b border-gray-100/60'}
            `}
        >
            {/* Left slot */}
            <div className="flex items-center w-11">
                {showBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} style={{ color: 'var(--color-text)' }} />
                    </button>
                )}
            </div>

            {/* Center */}
            <div className="flex-1 flex justify-center overflow-hidden px-1">
                {centerElement ? centerElement : (
                    title ? (
                        <h1
                            className="text-[17px] font-outfit font-bold tracking-tight truncate"
                            style={{ color: 'var(--color-text)' }}
                        >
                            {title}
                        </h1>
                    ) : null
                )}
            </div>

            {/* Right slot */}
            <div className="flex items-center justify-end w-11">
                {rightElement}
            </div>
        </header>
    );
};

export default Header;
