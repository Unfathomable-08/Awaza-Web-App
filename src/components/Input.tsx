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
                flex flex-row items-center h-[72px] px-[18px] gap-3 border-[0.4px] rounded-3xl bg-[#FAFAFA]
                focus-within:ring-2 focus-within:ring-primary/20 transition-all
                ${containerClassName}
            `}
            style={{ borderColor: colors.border }}
        >
            {icon && (
                <div className="flex items-center justify-center pl-4">
                    {icon}
                </div>
            )}
            <input
                ref={inputRef}
                className={`
                    flex-1 h-full bg-transparent outline-none px-4 text-[18px]
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
