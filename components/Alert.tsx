// components/Alert.tsx
import React, { useEffect } from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AlertProps } from './interface/AlertProps';

const MySwal = withReactContent(Swal);

const Alert: React.FC<AlertProps> = ({ message, type }) => {
    useEffect(() => {
        let iconType: SweetAlertIcon;

        switch (type) {
            case 'success':
                iconType = 'success';
                break;
            case 'error':
                iconType = 'error';
                break;
            case 'warning':
                iconType = 'warning';
                break;
            case 'info':
                iconType = 'info';
                break;
            default:
                iconType = 'info'; // Defaulting to 'info' if no matching type
        }

        MySwal.fire({
            icon: iconType,
            title: message,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: '#fff',
            customClass: {
                popup: 'tw-rounded-lg tw-shadow-lg',
                title: `tw-text-${type}-800`,
            }
        });
    }, [message, type]);

    return null; // No need to return any JSX since SweetAlert2 handles the UI.
};

export default Alert;
