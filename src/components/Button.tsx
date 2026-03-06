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
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({
    className = '',
    textClassName = '',
    title = '',
    onClick = () => { },
    loading = false,
    hasShadow = false,
    disabled = false,
    variant = 'primary',
}) => {

    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return {
                    bg: colors.secondary,
                    text: 'white',
                    border: 'none'
                };
            case 'outline':
                return {
                    bg: 'transparent',
                    text: colors.text,
                    border: `1px solid ${colors.border}`
                };
            case 'ghost':
                return {
                    bg: 'transparent',
                    text: colors.primary,
                    border: 'none'
                };
            default:
                return {
                    bg: colors.primary,
                    text: 'white',
                    border: 'none'
                };
        }
    };

    const styles = getVariantStyles();
    const shadowClass = hasShadow ? 'shadow-premium' : '';
    const opacityClass = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'active-scale btn-hover';

    return (
        <button
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
            className={`
                flex items-center justify-center rounded-xl py-3 w-full px-6
                font-outfit font-bold text-[17px] tracking-wide
                ${shadowClass} ${opacityClass} ${className}
            `}
            style={{
                backgroundColor: styles.bg,
                color: styles.text,
                border: styles.border,
            }}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <span className={textClassName}>
                    {title}
                </span>
            )}
        </button>
    );
};

export default Button;
