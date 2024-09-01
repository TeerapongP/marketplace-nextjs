import React, { useState } from 'react';
import SearchInputProps from './interface/SearchInputProps';

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, onClick }) => {
    const [searchValue, setSearchValue] = useState('');

    // Handles input field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    // Handles search button click
    const handleSearchClick = () => {
        if (searchValue.trim()) { // Check if searchValue is not just whitespace
            onSearch(searchValue); // Emit current searchValue
            onClick(searchValue); // Execute onClick prop with searchValue
        } else {
            onSearch('');
            onClick('');
        }
        setSearchValue(''); // Clear the input field
    };

    // Handles key down event on the input field
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearchClick(); // Trigger search on Enter key
        }
    };

    return (
        <>
            <form className="tw-w-64" onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission */}
                <div className="tw-relative">
                    <input
                        type="search"
                        id="default-search"
                        value={searchValue}
                        onChange={handleChange} // Update searchValue on input change
                        onKeyDown={handleKeyDown} // Handle key down events
                        className="tw-block tw-w-full tw-p-4 tw-pr-10 tw-text-sm tw-text-gray-900 tw-border tw-border-gray-300 tw-rounded-lg tw-focus:border-none tw-focus:ring-0"
                        placeholder="Search"
                    />
                    <div
                        className="tw-absolute tw-inset-y-0 tw-end-0 tw-flex tw-items-center tw-pe-3 tw-pointer-events-auto tw-cursor-pointer"
                        onClick={handleSearchClick} // Event handler for click
                    >
                        <svg
                            className="tw-w-4 tw-h-4 tw-text-gray-500 dark:tw-text-gray-400 cursor-pointer"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                </div>
                <label
                    htmlFor="default-search"
                    className="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 tw-sr-only dark:tw-text-white">
                    Search
                </label>
            </form>
        </>
    );
};

export default SearchInput;
