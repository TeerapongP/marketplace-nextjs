// components/Alert.tsx
import React, { useEffect, useState } from 'react';
import { AlertProps } from './interface/AlertProps';

const Alert: React.FC<AlertProps> = ({ message, type }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 5000);
        return () => clearTimeout(timer);
    }, []);

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
        isVisible && (
            <div
                className={`tw-fixed tw-bottom-4 tw-right-4 tw-w-80 tw-p-4 tw-border-l-4 ${bgColor} ${textColor} ${borderColor} tw-rounded-lg tw-shadow-lg tw-transition-opacity tw-duration-500 ${
                    isVisible ? 'tw-animate-fadeIn' : 'tw-animate-fadeOut'
                }`}
            >
                <div className="tw-flex tw-items-center">
                    <svg
                        className="tw-h-6 tw-w-6 tw-mr-2"
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
            </div>
        )
    );
};

export default Alert;
