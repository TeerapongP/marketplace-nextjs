import React from 'react';
import ButtonProps from './interface/ButtonProps'
const Button: React.FC<ButtonProps> = ({ text, color,textColor,width }) => {
    return (
        <button
            className={`tw-px-4 tw-py-2 tw-rounded-md ${textColor} ${width} tw-font-medium ${color} tw-shadow-md hover:tw-shadow-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2`}>
            {text}
        </button>
    );
};

export default Button;