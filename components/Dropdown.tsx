'use client';

import React, { useState, useEffect } from 'react';
import DropdownProps from './interface/DropdownProps'
import Role from './interface/Role'

const Dropdown: React.FC<DropdownProps> = ({ url, onSelect, placeholder = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Role | null>(null);
    const [options, setOptions] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setOptions(data || []); // Adjust according to the actual response structure
                } else {
                    setError('Failed to load options.');
                }
            } catch (error) {
                setError('An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [url]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (role: Role) => {
        setSelected(role);
        setIsOpen(false);
        onSelect(role.roleId);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="tw-text-red-500">{error}</p>;

    return (
        <div className="tw-relative tw-mt-2">
            <button
                type="button"
                onClick={toggleDropdown}
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-text-gray-700 tw-text-left tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-indigo-500"
            >
                {selected ? selected.roleName : placeholder}
            </button>
            {isOpen && (
                <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-full tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-lg tw-z-10">
                    {options.map((role) => (
                        <button
                            key={role.roleId}
                            onClick={() => handleSelect(role)}
                            className="tw-w-full tw-px-4 tw-py-2 tw-text-gray-700 tw-text-left hover:tw-bg-gray-100 tw-rounded-md"
                        >
                            {role.roleName}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;