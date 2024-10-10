import React, { useEffect } from 'react';
import ModalProps from './interface/ModalProps';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, footer, children }) => {

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-50 tw-animate-fadeIn">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-overflow-hidden tw-transform tw-scale-100 tw-animate-modalFadeIn">
                <div className="tw-p-4 tw-border-b">
                    <h2 className="tw-text-lg tw-font-semibold">{title}</h2>
                </div>
                <div className="tw-p-4">
                    {children}
                </div>
                {footer && (
                    <div className="tw-p-4 tw-border-t tw-flex tw-justify-end">
                        {footer}
                    </div>
                )}
            </div>
            <button
                className="tw-fixed tw-top-4 tw-right-4 tw-text-gray-600 tw-hover:text-gray-800 tw-text-xl"
                onClick={onClose}
                aria-label="Close modal"
            >
                &times;
            </button>
        </div>
    );
};

export default Modal;
