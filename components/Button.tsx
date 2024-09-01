import React from 'react';
import ButtonProps from './interface/ButtonProps';

const Button: React.FC<ButtonProps> = ({
    type = 'button',
    text,
    width,
    height,
    textColor,
    color,
    onClick,
    disabled = false, // Default to false if not provided
}) => {
    return (
        <button
            type={type}
            className={`tw-px-4 tw-py-2 tw-rounded-md tw-text-center custom-sm:tw-text-xs ${textColor} ${width} ${height} tw-font-medium ${color} tw-shadow-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 ${disabled
                    ? 'tw-bg-gray-300 tw-text-gray-600 tw-cursor-not-allowed'
                    : 'hover:tw-shadow-lg'
                }`}
            onClick={disabled ? undefined : onClick} // Prevent onClick if disabled
            disabled={disabled} // Set the button as disabled
        >
            {text}
        </button>
    );
};

export default Button;
