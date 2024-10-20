import React, { useState } from 'react';
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
    maxLength,
    multiple = false
}) => {

    return (
        <div className="relative">
            {type === 'file' ? (
                <>
                    <label
                        htmlFor="file-input"
                        className="tw-cursor-pointer tw-inline-block tw-text-center"
                    >
                        <input
                            type="file"
                            id="file-input"
                            className="tw-hidden"
                            multiple={multiple}
                            accept="image/*"
                            required={required}
                            onChange={onChange}
                        />
                    </label>
                    {/* Add the upload button */}
                    <div className="tw-flex tw-justify-center">
                        <button
                            type="button"
                            className="tw-bg-blue-500 tw-text-white tw-py-2 tw-px-4 tw-rounded-lg hover:tw-bg-blue-600"
                            onClick={() => document.getElementById('file-input')?.click()} // Simulate click on file input
                        >
                            Upload Image
                        </button>
                    </div>
                </>
            ) : (
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    required={required}
                    style={{ width, height }}
                    className={`tw-mt-1 tw-block tw-p-2 tw-pl-10 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:bg-blue-400 tw-focus:ring-2 tw-focus:ring-blue-400 tw-focus:border-blue-400 ${className}`}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

export default TextInput;
