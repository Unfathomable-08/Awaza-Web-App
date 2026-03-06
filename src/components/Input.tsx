import React from 'react';
import { colors } from '../constants/Colors';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    icon?: React.ReactNode;
    containerClassName?: string;
    inputRef?: React.RefObject<HTMLInputElement>;
    onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
    icon,
    containerClassName = '',
    inputRef,
    className = '',
    onChange,
    ...props
}) => {
    return (
        <div
            className={`
                flex flex-row items-center h-[64px] px-5 gap-4 rounded-[22px] 
                transition-all duration-200 border border-transparent
                focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-soft
                ${containerClassName}
            `}
            style={{ backgroundColor: colors.inputBg }}
        >
            {icon && (
                <div className="flex items-center justify-center opacity-40 focus-within:opacity-100 transition-opacity">
                    {React.cloneElement(icon as React.ReactElement, { size: 20 } as any)}
                </div>
            )}
            <input
                ref={inputRef}
                className={`
                    flex-1 h-full bg-transparent outline-none text-[16px] font-medium
                    placeholder:text-muted placeholder:font-normal
                    ${className}
                `}
                style={{ color: colors.text }}
                onChange={(e) => onChange?.(e.target.value)}
                {...props}
            />
        </div>
    );
};

export default Input;
