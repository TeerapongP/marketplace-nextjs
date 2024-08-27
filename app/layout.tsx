'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname hook
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUserRoleId, setCurrentUserRoleId] = useState<number | string>('');
  const [userName, setUserName] = useState<string>('');

  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    const roleId = localStorage.getItem('roleId');
    const storedUserName = localStorage.getItem('userName');
    setCurrentUserRoleId(roleId ? Number(roleId) : '');
    setUserName(storedUserName || '');
  }, []);

  const apiUrl = '/api/menu';

  const hideNavbar = '/login'  === pathname  || '/register' === pathname;
  return (
    <html lang="en">
      <body className={inter.className}>
        {!hideNavbar && (
          <Navbar url={apiUrl} userRoleId={Number(currentUserRoleId)} userName={userName} />
        )}
        <div className={`${hideNavbar ? 'tw-mt-0' : 'tw-mt-16'}`}>
          {children}
        </div>
      </body>
    </html>
  );
}
