import React from 'react';

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
                flex flex-row items-center py-3 px-4 gap-3 rounded-xl
                transition-all duration-200 border border-transparent
                focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-soft
                ${containerClassName}
            `}
            style={{ backgroundColor: 'var(--color-input-bg)' }}
        >
            {icon && (
                <div
                    className="flex items-center justify-center flex-shrink-0 opacity-40"
                    style={{ color: 'var(--color-text)' }}
                >
                    {React.cloneElement(icon as React.ReactElement, { size: 18 } as any)}
                </div>
            )}
            <input
                ref={inputRef}
                className={`
                    flex-1 h-full bg-transparent outline-none text-[15px] font-medium
                    placeholder:font-normal
                    ${className}
                `}
                style={{
                    color: 'var(--color-text)',
                    caretColor: 'var(--color-primary)',
                }}
                placeholder={props.placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                {...props}
            />
        </div>
    );
};

export default Input;
