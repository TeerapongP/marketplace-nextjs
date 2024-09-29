// shared/CloseButton.tsx
import React from 'react';
import EditButtonProps from './interface/EditButtonProps';

// Define the CloseButtonProps interface
const EditButton = ({ onClick, left }: EditButtonProps) => (
    <div
        className={`tw-absolute tw-top-0 tw-left-[-0.5rem] tw-h-8 tw-w-8 tw-bg-blue-600 tw-rounded-full tw-p-1 tw-shadow-md tw-cursor-pointer tw-z-40 tw-text-center`} // Use template literal for dynamic right value
        onClick={onClick} // Attach the onClick event handler
    >
        <i className="fas fa-regular fa-pen-to-square tw-text-white tw-w-4 tw-h-4"></i>
    </div>
);

export default EditButton;
