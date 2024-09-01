'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Custom404 from './404';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUserRoleId, setCurrentUserRoleId] = useState<number | string>('');
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | null>(null); // Add state for token

  const pathname = usePathname();

  useEffect(() => {
    const roleId = localStorage.getItem('roleId');
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token'); // Retrieve token from local storage

    if (storedToken) {
      setToken(storedToken);
      setCurrentUserRoleId(roleId ? Number(roleId) : '');
      setUserId(storedUserId || '');
    } else {
      setToken(null); // Ensure token is cleared if not present
    }
  }, []);

  const apiUrl = '/api/menu';

  // Determine if the navbar should be hidden based on pathname and depth
  const hideNavbar =
    pathname === '/pages/auth/login' ||
    pathname === '/pages/auth/register' ||
    pathname.split('/').length > 10;

  // Handle rendering of the 404 page
  const isValidPath = [
    '/',
    '/pages/auth/login',
    '/pages/auth/register',
    '/pages/category',
    '/pages/shop',
  ].includes(pathname);

  // Check if the current path requires a token to be valid
  const requiresToken = [
    '/pages/order',
    '/pages/delivery'
  ].includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        {(isValidPath || (requiresToken && token)) && !hideNavbar && (
          <Navbar url={apiUrl} userRoleId={Number(currentUserRoleId)} userId={userId} />
        )}
        <div className={`tw-mt-${hideNavbar ? '0' : '16'}`}>
          {(isValidPath || (requiresToken && token)) ? children : <Custom404 />}
        </div>
      </body>

    </html>
  );
}
