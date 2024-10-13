'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import './globals.css';
import Navbar from '@/components/Navbar';
import Custom404 from './404';
import { CartProvider } from './context/CartContext'; // Adjust the path as needed
import { MenuItem } from '@/components/interface/MenuItem'; // Adjust the path accordingly

const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUserRoleId, setCurrentUserRoleId] = useState<number | string>('');
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false); // State to track if the token is expired
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const pathname = usePathname();
  const router = useRouter(); // Router for navigation
  const apiUrl = '/api/menu';

  // Logic to hide navbar for certain paths
  const hideNavbar = pathname.startsWith('/pages/auth/') || pathname.split('/').length > 10;

  // Check if the current path is valid or requires a token
  const isValidPath = [
    '/',
    '/pages/auth/login',
    '/pages/auth/register',
    '/pages/category',
    '/pages/shop',
    '/pages/auth/forgotpassword',
  ].includes(pathname) || pathname.startsWith('/pages/products/');

  const requiresToken = [
    '/pages/order',
    '/pages/delivery',
    '/pages/profile',
    '/pages/orderHistory',
    '/pages/shop/shop-add',
    '/pages/reserveStall/reserveStall-fetch',
    '/pages/reserveStall/reserveStall-edit',
  ].some(path => pathname.startsWith(path)) || pathname.startsWith('/pages/shop/shop-edit/') || pathname.startsWith('/pages/products/product-edit/') || pathname.startsWith('/pages/products/product-add/');

  // Check if content should be rendered based on path and token status
  const shouldRenderContent = isValidPath || (requiresToken && token && !isTokenExpired);

  useEffect(() => {
    const roleId = localStorage.getItem('roleId');
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token'); // Get token from localStorage

    const checkTokenExpiration = (token: string | null) => {
      if (token) {
        try {
          const decodedToken = jwt.decode(token); // Decode the token (this does not verify)
          if (decodedToken && typeof decodedToken === 'object' && decodedToken.exp) {
            const currentTime = Date.now() / 1000; // Current time in seconds
            if (decodedToken.exp < currentTime) {
              setIsTokenExpired(true); // Token has expired
              router.push('/pages/auth/login'); // Redirect to login if token is expired
            } else {
              setIsTokenExpired(false); // Token is still valid
              setToken(token); // Set the token
            }
          } else {
            setIsTokenExpired(true); // Token is invalid or missing expiration
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setIsTokenExpired(true); // Mark as expired on error
        }
      }
    };
    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data: MenuItem[] = await res.json();
          setMenuItems(data);
        } else {
          console.error('Failed to fetch menu items');
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    // Initialize user data (roleId, userId, token)
    const initializeUserData = () => {
      setCurrentUserRoleId(roleId ? Number(roleId) : '');
      setUserId(storedUserId ?? '');
      checkTokenExpiration(storedToken); // Check if token is expired
    };
    initializeUserData();
    fetchMenuItems();
  }, [router]); // Added router to the dependency array


  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {/* Render Navbar only if shouldRenderContent is true */}
          {shouldRenderContent && !hideNavbar && (
            <div className="tw-my-16">
              <Navbar url={apiUrl} userRoleId={Number(currentUserRoleId)} userId={userId} menuItems={menuItems} />
            </div>
          )}

          {/* Adjust margin-top based on whether navbar is hidden and whether content is rendered */}
          <div className={`tw-my-${shouldRenderContent && !hideNavbar ? '16' : '0'}`}>
            {shouldRenderContent ? children : <Custom404 />}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
