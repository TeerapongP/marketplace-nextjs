'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

import { NavbarProps } from './interface/NavbarProps'; // Adjust the path as necessary
import { MenuItem } from './interface/MenuItem';
import TextInput from './Input';
import Button from './Button';

const Navbar: React.FC<NavbarProps> = ({ url, userRoleId ,userName}) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(url); // Use the url prop for fetching data
                if (res.ok) {
                    const data: MenuItem[] = await res.json();
                    setMenuItems(data);
                }
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchOptions();
    }, [url]); // Dependency on url to refetch if url changes
    const shouldShowSpecificItems = userRoleId === 0;
    const filteredMenuItems = menuItems.filter(item =>
        item.roles.some(role => role.roleId === Number(userRoleId))
    );

    // Check user authentication status, e.g., via a token or session check
    useEffect(() => {
        // Logic to check if the user is logged in
        const checkLoginStatus = () => {
            // Replace with actual login status check
            // For example, checking a token in localStorage or context
            const token = localStorage.getItem('authToken');
            setIsLoggedIn(!!token); // Set login status based on token presence
        };

        checkLoginStatus();
    }, []);

    const handleLoginClick = () => {
        router.push('/login'); // Navigate to /login
    };
    const handleSignoutClick = () => {
        // Handle signout logic here
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('roleId');

        setIsLoggedIn(false);
        router.push('/login');
    };

    
   
    return (
        <nav className="tw-bg-custom-green tw-px-4 tw-py-2 tw-fixed tw-w-full tw-top-0 tw-left-0 tw-z-50">
            <div className="tw-container tw-mx-auto tw-flex tw-justify-between tw-items-center">
                <div className="tw-w-1/6 tw-text-white tw-text-xl tw-font-bold">
                    <Link href="/" className="tw-text-black tw-text-2xl">
                        Market delivery
                    </Link>
                </div>
                <div className="tw-flex tw-grow tw-items-center">
                    <ul className="tw-flex tw-space-x-4 tw-text-white tw-text-xl">
                        {shouldShowSpecificItems ? (
                            <>
                                {menuItems.length > 0 && (
                                    <li key={menuItems[0].menuName}>
                                        <Link href={menuItems[0].menuUrl} className="tw-hover:tw-text-gray-400">
                                            {menuItems[0].menuName}
                                        </Link>
                                    </li>
                                )}
                                {menuItems.length > 1 && (
                                    <li key={menuItems[1].menuName}>
                                        <Link href={menuItems[1].menuUrl} className="tw-hover:tw-text-gray-400">
                                            {menuItems[1].menuName}
                                        </Link>
                                    </li>
                                )}
                            </>
                        ) : (
                            filteredMenuItems.map(item => (
                                <li key={item.menuName}>
                                    <Link href={item.menuUrl} className="tw-hover:tw-text-gray-400">
                                        {item.menuName}
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <div className="tw-flex tw-w-1/4 tw-justify-end">
                    <TextInput
                        type="text"
                        id="username"
                        value={''}
                        onChange={(e) => ""}
                        required
                        placeholder=""
                        className="tw-w-full"
                    />
                </div>
                <div className="tw-flex tw-w-1/4 tw-justify-end tw-space-x-4">
                {!userName && (
                    <Button type="submit" text="Login" width="tw-w-20" textColor='tw-text-black' color="tw-bg-white" onClick={handleLoginClick} />)}
                    {userName && (
                    <Button type="button" text="Logout" width="tw-w-20" textColor='tw-text-black' color="tw-bg-white"  onClick={handleSignoutClick } /> )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
