import React from 'react';
import ButtonProps from './interface/ButtonProps'
const Button: React.FC<ButtonProps> = ({ type = 'button', text, width, textColor, color, onClick }) => {
    return (
        <button
            type={type}
            className={`tw-px-4 tw-py-2 tw-rounded-md ${textColor} ${width} tw-font-medium ${color} tw-shadow-md hover:tw-shadow-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2`}
            onClick={onClick} // Apply onClick prop
        >
            {text}
        </button>
    );
};

export default Button;