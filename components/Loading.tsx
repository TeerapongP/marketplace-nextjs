import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
            <div className="tw-border-4 tw-border-t-transparent tw-border-blue-500 tw-rounded-full tw-w-16 tw-h-16 tw-animate-spin"></div>
        </div>
    );
};

export default Loading;
