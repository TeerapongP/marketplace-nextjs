import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NavbarProps } from './interface/NavbarProps';
import Alert from '@/components/Alert';
import { useCart } from '../app/context/CartContext';
import Button from './Button';
import UserAvatarIcon from './UserAvatarIcon';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const Navbar: React.FC<NavbarProps> = ({ userRoleId, className, menuItems }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
    const router = useRouter();
    const [imagesPath, setImagesPath] = useState<string | null>(null);
    const { state: { cartItems }, dispatch } = useCart();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            localStorage.setItem('roleId', session?.user?.role);
            localStorage.setItem('userId', session?.user?.id);
            localStorage.setItem('token', session?.user?.customToken);
        }
    }, [session]);
    useEffect(() => {
        setImagesPath(process.env.NEXT_PUBLIC_LOCAL_BASE_URL ?? '');
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [dispatch, session]);


    const handleLoginClick = () => router.push('/pages/auth/login');
    const handleSignOutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('roleId');
        localStorage.removeItem('userName');
        signOut({
            redirect: false, // Prevent automatic redirect (if needed)
        }).then(() => {
            // Redirect to login page after sign-out
            router.push('/pages/auth/login');
            setIsLoggedIn(false);
        }).catch((err) => {
            console.error('Error signing out:', err);
        });
    };
    const handleCartClick = () => setDropdownOpen(prev => !prev);

    const filteredMenuItems = useMemo(() => {
        // If userRoleId is 0, show first 2 items
        if (userRoleId === 0) {
            return menuItems.slice(0, 2);
        }

        // If roleId exists in roles or roles array is empty, show the item
        return menuItems.filter(item =>
            item.roles.length === 0 || // Show if roles array is empty
            item.roles.some(role => role.roleId === Number(userRoleId)) // Show if role matches userRoleId
        );
    }, [menuItems, userRoleId]);

    const handleDelete = async (cartsId: number) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/carts/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ cartId: cartsId }),
            });

            if (response.ok) {
                dispatch({ type: 'REMOVE_FROM_CART', payload: cartsId });
                setAlertMessage("Item removed from cart");
                setAlertType('success');
            } else {
                const errorData = await response.json();
                setAlertMessage(`Error: ${errorData.message}`);
                setAlertType('error');
            }
        } catch (error) {
            setAlertMessage(`Error removing item from cart: ${error}`);
            setAlertType('error');
        }
    };

    return (

        <nav className={`tw-bg-custom-green tw-px-4 tw-py-2 tw-fixed tw-w-full tw-top-0 tw-left-0 tw-z-50 ${className}`}>
            <div className='tw-grid tw-grid-cols-2 tw-w-full'>
                <div className='tw-w-full tw-flex tw-space-x-4'>
                    <Link href="/" className="tw-font-bold tw-text-black tw-text-2xl md:tw-text-xl sm:tw-text-sm custom-sm:tw-text-base">
                        Market delivery
                    </Link>
                    <ul className="tw-flex tw-space-x-4 tw-text-white lg:tw-text-xl md:tw-text-base sm:tw-text-base custom-sm:text-base custom-sm:tw-text-center tw-tw-ml-5">
                        {filteredMenuItems.length > 0 ? (
                            filteredMenuItems.map(item => (
                                <li key={item.menuName}>
                                    <Link href={item.menuUrl} className="tw-hover:tw-text-gray-400">
                                        {item.menuName}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li>No menu items available</li>
                        )}

                    </ul>
                </div>
                <div className="tw-flex tw-space-x-4 tw-items-center tw-justify-end">

                    {isLoggedIn === null ? (
                        <></>
                    ) : !isLoggedIn && !session?.user ? (
                        <div className="tw-flex">
                            <UserAvatarIcon className="tw-mr-4" />
                            <Button
                                type="submit"
                                text="Login"
                                width="tw-w-20 custom-sm:tw-w-16"
                                height="tw-h-10"
                                textColor="tw-text-black"
                                color="tw-bg-white"
                                onClick={handleLoginClick}
                            />
                        </div>
                    ) : (
                        <>
                            <span>{session?.user?.name ?? localStorage.getItem('userName')}</span>
                            <UserAvatarIcon className="tw-mr-4" />
                            <Button
                                type="button"
                                text="Logout"
                                width="tw-w-20 custom-sm:tw-w-15"
                                textColor="tw-text-black"
                                color="tw-bg-white"
                                onClick={handleSignOutClick}
                            />
                            <div className="tw-relative">
                                <div
                                    className="tw-flex tw-items-center tw-cursor-pointer"
                                    onClick={handleCartClick}
                                >
                                    <i className="fas fa-shopping-cart tw-w-5 tw-h-5 tw-text-white tw-mr-2"></i>
                                    <span className="tw-bg-white tw-text-black tw-rounded-full tw-px-2 tw-py-1 tw-text-sm">
                                        {cartItems.length}
                                    </span>
                                </div>
                                {dropdownOpen && (
                                    <div className={`tw-absolute tw-right-0 tw-top-full tw-mt-2 tw-bg-white tw-text-black tw-shadow-lg tw-rounded-md tw-w-64 tw-p-4 tw-border tw-border-gray-200`}>
                                        <h4 className="tw-font-bold tw-text-lg tw-border-b tw-pb-2">Cart Items</h4>
                                        <ul className="tw-space-y-2">
                                            {cartItems.length === 0 ? (
                                                <li className="tw-text-gray-500">No items in the cart</li>
                                            ) : (
                                                Object.values(
                                                    cartItems.reduce((acc: { [key: string]: any }, item: any) => {
                                                        if (acc[item.productName]) {
                                                            acc[item.productName].quantity += item.quantity;
                                                        } else {
                                                            acc[item.productName] = { ...item };
                                                        }
                                                        return acc;
                                                    }, {})
                                                ).map((item, index) => {
                                                    const isLocalImage =
                                                        !item.images.startsWith('http://') &&
                                                        !item.images.startsWith('https://');
                                                    const imageUrl = isLocalImage
                                                        ? `${imagesPath}${item.images}`
                                                        : item.images;
                                                    return (
                                                        <li
                                                            key={`${item.productId}-${index}`} // Ensure key is unique
                                                            className='tw-flex tw-items-center tw-p-2 tw-border-b tw-border-gray-200 hover:bg-gray-100 transition-colors duration-300'
                                                        >
                                                            <Image
                                                                src={imageUrl}
                                                                alt={item.productName}
                                                                className="tw-h-16 tw-w-16 tw-object-cover tw-rounded-md tw-mr-2"
                                                                width={64}
                                                                height={64}
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/path/to/fallback/image.png';
                                                                }}
                                                            />
                                                            <div className='tw-flex-1'>
                                                                <span className='tw-font-semibold'>{item.productName}</span>
                                                                <div className='tw-text-gray-600'>Quantity: {item.quantity}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDelete(item.cartsId)}
                                                                className='tw-text-red-600 tw-ml-4 hover:tw-text-red-800'
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </li>
                                                    );
                                                })
                                            )}
                                        </ul>

                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {alertMessage && alertType && (
                <Alert type={alertType} message={alertMessage} />
            )}
        </nav>
    );
};

export default Navbar;
