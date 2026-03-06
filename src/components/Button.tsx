import React from 'react';
import { colors } from '../constants/Colors';

interface ButtonProps {
    className?: string;
    textClassName?: string;
    title?: string;
    onClick?: () => void;
    loading?: boolean;
    hasShadow?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    className = '',
    textClassName = '',
    title = '',
    onClick = () => { },
    loading = false,
    hasShadow = true,
    disabled = false,
}) => {
    const shadowClass = hasShadow ? 'shadow-md' : '';
    const opacityClass = (disabled || loading) ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 transition-all';

    return (
        <button
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
            className={`
                flex items-center justify-center rounded-3xl h-14 w-full px-6
                ${shadowClass} ${opacityClass} ${className}
            `}
            style={{ backgroundColor: loading ? 'white' : colors.primary }}
        >
            {loading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: `${colors.primary} transparent ${colors.primary} ${colors.primary}` }}></div>
            ) : (
                <span className={`text-white font-bold text-lg ${textClassName}`}>
                    {title}
                </span>
            )}
        </button>
    );
};

export default Button;
