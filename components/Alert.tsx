// components/Alert.tsx
import React from 'react';

type AlertProps = {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
};

const Alert: React.FC<AlertProps> = ({ message, type }) => {
    let bgColor, textColor, borderColor;

    switch (type) {
        case 'success':
            bgColor = 'tw-bg-green-100';
            textColor = 'tw-text-green-800';
            borderColor = 'tw-border-green-400';
            break;
        case 'error':
            bgColor = 'tw-bg-red-100';
            textColor = 'tw-text-red-800';
            borderColor = 'tw-border-red-400';
            break;
        case 'warning':
            bgColor = 'tw-bg-yellow-100';
            textColor = 'tw-text-yellow-800';
            borderColor = 'tw-border-yellow-400';
            break;
        case 'info':
            bgColor = 'tw-bg-blue-100';
            textColor = 'tw-text-blue-800';
            borderColor = 'tw-border-blue-400';
            break;
        default:
            bgColor = 'tw-bg-gray-100';
            textColor = 'tw-text-gray-800';
            borderColor = 'tw-border-gray-400';
    }

    return (
        <div className={`tw-flex tw-items-center tw-px-4 tw-py-3 tw-border-l-4 ${bgColor} ${textColor} ${borderColor} tw-rounded`}>
            <svg
                className="tw-h-5 tw-w-5 tw-mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                        type === 'success'
                            ? 'M5 13l4 4L19 7'
                            : type === 'error'
                                ? 'M6 18L18 6M6 6l12 12'
                                : type === 'warning'
                                    ? 'M12 8v4m0 4h.01'
                                    : 'M12 16h.01M12 8v4'
                    }
                />
            </svg>
            <span className="tw-font-medium">{message}</span>
        </div>
    );
};

export default Alert;
