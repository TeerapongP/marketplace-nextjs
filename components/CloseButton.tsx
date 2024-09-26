// shared/CloseButton.tsx
import React from 'react';
import CloseButtonProps from './interface/CloseButtonProps';

// Define the CloseButtonProps interface
const CloseButton = ({ onClick }: CloseButtonProps) => (
    <div
        className="tw-absolute tw-top-0 tw-right-0 tw-h-8 tw-w-8 tw-bg-red-600 tw-rounded-full tw-p-1 tw-shadow-md tw-cursor-pointer tw-z-40 tw-text-center"
        onClick={onClick} // Attach the onClick event handler
    >
        <i className="fas fa-times tw-text-white tw-w-4 tw-h-4"></i>
    </div>
);

export default CloseButton;
