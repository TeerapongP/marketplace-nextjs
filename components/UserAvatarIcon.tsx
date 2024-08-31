import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Make sure you import Image from Next.js

interface UserAvatarIconProps {
    className?: string;
}

const UserAvatarIcon: React.FC<UserAvatarIconProps> = ({ className }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedToken = localStorage.getItem('token');
        const userIdNumber = storedUserId ? parseInt(storedUserId, 10) : null;
        setUserId(userIdNumber);
        setToken(storedToken);

        const fetchImage = async () => {
            if (userId === null || token === null) return;

            try {
                const response = await fetch(`/api/profileImage?id=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setImageUrl(data.imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, [userId, token]); // Add token as a dependency

    return (
        <div className={`tw-relative tw-w-10 tw-h-10 tw-overflow-hidden tw-bg-gray-100 tw-rounded-full tw-dark:bg-gray-600 ${className}`}>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="User Avatar"
                    fill // Use fill for responsive images
                    style={{ objectFit: 'cover' }} // Ensure the image covers the container
                    sizes="(max-width: 640px) 100vw, 50vw" // Adjust based on your design needs
                    className="tw-absolute tw-w-full tw-h-full"
                />
            ) : (
                <svg
                    className="tw-absolute tw-w-12 tw-h-12 tw-text-gray-400 -tw-left-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                    ></path>
                </svg>
            )}
        </div>
    );
};

export default UserAvatarIcon;
