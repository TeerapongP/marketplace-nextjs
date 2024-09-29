'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import DropdownProps from './interface/DropdownProps';

const Dropdown: React.FC<DropdownProps> = ({
    url,
    onSelect,
    placeholder = "",
    valueString = "",
    keyString = "",
    value,
    disable,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<null | Record<string, any>>(null); // Define specific type for selected
    const [options, setOptions] = useState<Array<Record<string, any>>>([]); // Define specific type for options
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Fetch the dropdown options from the API
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const foundOption = data.find((option: any) => {
                    const [idKey] = valueString.split(',');
                    return value && option[idKey] === value;
                });
                setSelected(foundOption);
                setOptions(data); // Assuming the API returns an array of objects
            } catch (error) {
                console.error('Error fetching options:', error);
                setError(error instanceof Error ? error.message : 'Error fetching options');
            }
        };

        fetchOptions();
    }, [url, value, valueString]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => setIsOpen(prev => !prev);

    const handleSelect = useCallback((selectedOption: any) => {
        const [idKey] = valueString.split(',');
        const id = selectedOption[idKey];
        onSelect(id);
        setSelected(selectedOption); // Store the entire selected option
        setIsOpen(false); // Close the dropdown after selection
    }, [onSelect, valueString]);

    return (
        <div className="tw-relative tw-mt-2" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-text-gray-700 tw-text-left tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-indigo-500"
                aria-haspopup="true"
                aria-expanded={isOpen}
                disabled={disable}
            >
                {selected ? selected[keyString.split(',')[1]] : placeholder}
            </button>
            {isOpen && (
                <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-full tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-lg tw-z-10">
                    {options.map((data) => (
                        <button
                            key={data[valueString.split(',')[0]]}
                            onClick={() => handleSelect(data)}
                            className="tw-w-full tw-px-4 tw-py-2 tw-text-gray-700 tw-text-left hover:tw-bg-gray-100 tw-rounded-md"
                        >
                            {data[keyString.split(',')[1]]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
