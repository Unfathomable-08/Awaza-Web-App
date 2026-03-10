import React from 'react';

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

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
        },
        secondary: {
            backgroundColor: 'var(--color-text)',
            color: 'white',
            border: 'none',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            border: '1.5px solid var(--color-border)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-primary)',
            border: 'none',
        },
    };

    const shadowClass = hasShadow ? 'shadow-premium' : '';
    const opacityClass = (disabled || loading) ? 'opacity-40 cursor-not-allowed' : 'active-scale btn-hover';

    return (
        <button
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
            className={`
                flex items-center justify-center rounded-xl h-12 w-full px-6
                font-outfit font-bold text-[16px] tracking-wide
                transition-all
                ${shadowClass} ${opacityClass} ${className}
            `}
            style={variantStyles[variant]}
        >
            {loading ? (
                <div
                    className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
                />
            ) : (
                <span className={textClassName}>{title}</span>
            )}
        </button>
    );
};

export default Button;
