'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { NavbarProps } from './interface/NavbarProps'; // Adjust the path as necessary
import { MenuItem } from './interface/MenuItem';
import Button from './Button';
import UserAvatarIcon from './UserAvatarIcon';
import Loading from './Loading';

const Navbar: React.FC<NavbarProps> = ({ url, userRoleId }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Use null to represent loading state
    const [loading, setLoading] = useState(true); // Loading state for fetching data
    const [cartItems, setCartItems] = useState<number>(0); // State for cart items
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // State for dropdown menu

    const router = useRouter();

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const data: MenuItem[] = await res.json();
                    setMenuItems(data);
                }
            } catch (error) {
                console.error('Error fetching menu items:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchOptions();
    }, [url]);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            const fetchCartItems = () => {
                // Fetch cart items from local storage or an API
                const cart = localStorage.getItem('cartItems');
                setCartItems(cart ? JSON.parse(cart).length : 0);
            };

            fetchCartItems();
        }
    }, [isLoggedIn]);

    const handleLoginClick = () => {
        router.push('/pages/auth/login');
    };

    const handleProfile = () => {
        router.push('/pages/profile');
    };

    const handleSignoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('roleId');
        setIsLoggedIn(false);
        router.push('/pages/auth/login');
    };

    const handleCartClick = () => {
        setDropdownOpen(prevState => !prevState); // Toggle dropdown visibility
    };

    if (loading) {
        return <Loading />; // Display loading state
    }

    const shouldShowSpecificItems = userRoleId === 0;
    const filteredMenuItems = menuItems.filter(item =>
        item.roles.some(role => role.roleId === Number(userRoleId))
    );

    return (
        <nav className="tw-bg-custom-green tw-px-4 tw-py-2 tw-fixed tw-w-full tw-top-0 tw-left-0 tw-z-50">
            <div className='tw-grid tw-grid-cols-2 tw-w-full'>
                <div className='tw-w-full tw-flex tw-space-x-4'>
                    <Link href="/" className="tw-font-bold tw-text-black tw-text-2xl md:tw-text-xl sm:tw-text-sm custom-sm:tw-text-base">
                        Market delivery
                    </Link>
                    <ul className="tw-flex tw-space-x-4 tw-text-white lg:tw-text-xl md:tw-text-base sm:tw-text-base custom-sm:text-base custom-sm:tw-text-center tw-tw-ml-5">
                        {shouldShowSpecificItems ? (
                            menuItems.slice(0, 2).map(item => (
                                <li key={item.menuName}>
                                    <Link href={item.menuUrl} className="tw-hover:tw-text-gray-400">
                                        {item.menuName}
                                    </Link>
                                </li>
                            ))
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
                <div className='tw-flex tw-space-x-4 tw-items-center tw-justify-end'>
                    {isLoggedIn === null ? (
                        <div>Loading...</div>
                    ) : !isLoggedIn ? (
                        <div className='tw-flex'>
                            <UserAvatarIcon className='tw-mr-4' />
                            <Button type="submit" text="Login" width="tw-w-20 custom-sm:tw-w-16" height='tw-h-10' textColor='tw-text-black' color="tw-bg-white" onClick={handleLoginClick} />
                        </div>
                    ) : (
                        <>
                            <div className='tw-flex'>
                                <UserAvatarIcon className='tw-mr-4 tw-cursor-pointer' onClick={handleProfile} />
                                <Button type="button" text="Logout" width="tw-w-20 custom-sm:tw-w-15" textColor='tw-text-black' color="tw-bg-white" onClick={handleSignoutClick} />
                            </div>
                            <div className='tw-relative'>
                                <div className='tw-flex tw-items-center tw-cursor-pointer' onClick={handleCartClick}>
                                    <i className="fas fa-shopping-cart tw-w-5 tw-h-5 tw-text-white tw-mr-2"></i>
                                    <span className="tw-bg-white tw-text-black tw-rounded-full tw-px-2 tw-py-1 tw-text-sm">{cartItems}</span>
                                </div>
                                {dropdownOpen && (
                                    <div className='tw-absolute tw-right-0 tw-top-full tw-mt-2 tw-bg-white tw-text-black tw-shadow-lg tw-rounded-md tw-w-64 tw-p-4'>
                                        <h4 className='tw-font-bold tw-text-lg'>Cart Items</h4>
                                        {/* Placeholder for cart item details */}
                                        <ul>
                                            {/* Render cart items here */}
                                            <li>No items in the cart</li>
                                        </ul>
                                        <Link href="/pages/order" className='tw-block tw-mt-2 tw-text-blue-600 tw-hover:tw-text-blue-800'>View Cart</Link>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
