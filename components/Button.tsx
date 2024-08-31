import React from 'react';
import ButtonProps from './interface/ButtonProps'
const Button: React.FC<ButtonProps> = ({ type = 'button', text, width,height, textColor, color, onClick }) => {
    return (
        <button
            type={type}
            className={`tw-px-4 tw-py-2 tw-rounded-md tw-text-center custom-sm:tw-text-xs ${textColor} ${width} ${height} tw-font-medium ${color} tw-shadow-md hover:tw-shadow-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2`}
            onClick={onClick}>
                 {text}

        </button>


    );
};

export default Button;