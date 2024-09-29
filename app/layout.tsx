'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Custom404 from './404';
import { CartProvider } from './context/CartContext'; // Adjust the path as needed

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUserRoleId, setCurrentUserRoleId] = useState<number | string>('');
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const roleId = localStorage.getItem('roleId');
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    setToken(storedToken);
    setCurrentUserRoleId(roleId ? Number(roleId) : '');
    setUserId(storedUserId || '');
  }, []);

  const apiUrl = '/api/menu';

  const hideNavbar = pathname.startsWith('/pages/auth/') || pathname.split('/').length > 10;

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
  ].some(path => pathname.startsWith(path)) || pathname.startsWith('/pages/shop/shop-edit/') || pathname.startsWith('/pages/products/product-edit/') || pathname.startsWith('/pages/products/product-add/');

  const shouldRenderContent = isValidPath || (requiresToken && token);

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {!hideNavbar && (
            <div className="tw-my-16">
              <Navbar url={apiUrl} userRoleId={Number(currentUserRoleId)} userId={userId} />
            </div>
          )}
          <div className={`tw-my-${hideNavbar ? '0' : '16'}`}>
            {shouldRenderContent ? children : <Custom404 />}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
