'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

import { NavbarProps } from './interface/NavbarProps'; // Adjust the path as necessary
import { MenuItem } from './interface/MenuItem';
import Button from './Button';


const Navbar: React.FC<NavbarProps> = ({ url, userRoleId, userName }) => {
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
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('authToken');
            setIsLoggedIn(!!token); 
        };
        checkLoginStatus();
    }, []);

    const handleLoginClick = () => {
        router.push('/pages/auth/login'); // Navigate to /login
    };
    const handleSignoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('roleId');

        setIsLoggedIn(false);
        router.push('/pages/auth/login');
    };
   
    
    return (
        <nav className="tw-bg-custom-green tw-px-4 tw-py-2 tw-fixed tw-w-full tw-top-0 tw-left-0 tw-z-50">
            <div className='tw-grid tw-grid-cols-2 tw-w-full'>
                <div className='tw-w-full tw-flex  tw-space-x-4'>
                    <Link href="/" className="tw-font-bold tw-text-black tw-text-2xl md:tw-text-xl sm:tw-text-sm custom-sm:tw-text-base">
                        Market delivery
                    </Link>
                    <ul className="tw-flex tw-space-x-4 tw-text-white lg:tw-text-xl md:tw-text-base sm:tw-text-base custom-sm:text-base custom-sm:tw-text-center tw-tw-ml-5">
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
                <div className='tw-grid tw-justify-items-end custom-sm:tw-mx-24'>
                    {!userName && (
                        <Button type="submit" text="Login" width="tw-w-20 custom-sm:tw-w-15" textColor='tw-text-black' color="tw-bg-white" onClick={handleLoginClick} />)}
                    {userName && (
                        <Button type="button" text="Logout" width="tw-w-20 custom-sm:tw-w-15" textColor='tw-text-black' color="tw-bg-white" onClick={handleSignoutClick} />)}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
