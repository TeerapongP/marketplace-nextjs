import React from 'react';
import TextInputProps from './interface/TextInputProps';

const TextInput: React.FC<TextInputProps> = ({
    id,
    value,
    width,
    height,
    onChange,
    required = false,
    className = '',
    type = 'text',
    placeholder = '',
    maxLength
}) => {
    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                required={required}
                width={width}
                height={height}
                className={`tw-mt-1 tw-block tw-p-2 tw-pl-10 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:bg-blue-400 tw-focus:ring-2 tw-focus:ring-blue-400 tw-focus:border-blue-400 ${className}`}
                placeholder={placeholder}
            />
        </div>
    );
};
export default TextInput;
