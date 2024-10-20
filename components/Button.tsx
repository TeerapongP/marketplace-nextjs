// components/Button.tsx
import React from 'react';
const Button: React.FC<ButtonProps> = ({
    type = 'button',
    text,
    width = '',
    height = '',
    textColor = '',
    color = '',
    onClick,
    className = '',
    disabled = false,
    children,
}) => {
    return (
        <button
            type={type}
            className={`tw-px-4 tw-py-2 tw-rounded-md tw-text-center ${textColor} ${width} ${height} tw-font-medium ${color} tw-shadow-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 ${disabled ? 'tw-bg-gray-300 tw-text-gray-600 tw-cursor-not-allowed' : 'hover:tw-shadow-lg'} ${className}`}
            onClick={disabled ? undefined : onClick} // Handle disabled state
            disabled={disabled}
        >
            {text && <span>{text}</span>}
            {children}
        </button>
    );
};

export default Button;
