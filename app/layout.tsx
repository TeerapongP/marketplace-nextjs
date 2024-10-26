// app/RootLayoutClient.tsx

'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import jwt from 'jsonwebtoken';
import './globals.css';
import Navbar from '@/components/Navbar';
import Custom404 from './404';
import { CartProvider } from './context/CartContext';
import { MenuItem } from '@/components/interface/MenuItem';
import SessionProvider from '../components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutClientProps {
  session: any; // Adjust this to your session type
  children: ReactNode;
}

export default function RootLayoutClient({ session, children }: RootLayoutClientProps) {
  const [currentUserRoleId, setCurrentUserRoleId] = useState<number | string>('');
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const pathname = usePathname();
  const router = useRouter();
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
    '/pages/reserveStall/reserveStall-fetch',
    '/pages/reserveStall/reserveStall-edit',
  ].some(path => pathname.startsWith(path)) || pathname.startsWith('/pages/shop/shop-edit/') || pathname.startsWith('/pages/products/product-edit/') || pathname.startsWith('/pages/products/product-add/');

  const shouldRenderContent = isValidPath || (requiresToken && token && !isTokenExpired);


  useEffect(() => {
    const roleId = localStorage.getItem('roleId');
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    const checkTokenExpiration = (token: string | null) => {
      if (token) {
        try {
          const decodedToken = jwt.decode(token) as { exp?: number };
          if (decodedToken && decodedToken.exp) {
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
              setIsTokenExpired(true);
              router.push('/pages/auth/login');
            } else {
              setIsTokenExpired(false);
              setToken(token);
            }
          } else {
            setIsTokenExpired(true);
          }
        } catch (error) {
          setIsTokenExpired(true);
        }
      }
    };

    const fetchMenuItems = async () => {
      try {
        const res = await fetch(apiUrl);
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

    const initializeUserData = () => {
      const currentRoleId = roleId ? Number(roleId) : '';
      setCurrentUserRoleId(currentRoleId);
      setUserId(storedUserId ?? '');
      checkTokenExpiration(storedToken);

      // Update local storage if data is not already present
      if (!roleId) localStorage.setItem('roleId', currentRoleId.toString());
      if (!storedUserId) localStorage.setItem('userId', storedUserId ?? '');
      if (!storedToken) localStorage.setItem('token', storedToken ?? '');
    };

    initializeUserData();
    fetchMenuItems();
  }, [router, session]);

  return (
    <html lang="en" className={inter.className}>
      <body>
        <SessionProvider session={session}>
          <CartProvider>
            {shouldRenderContent && !hideNavbar && (
              <div className="tw-my-16">
                <Navbar url={apiUrl} userRoleId={Number(currentUserRoleId)} userId={userId} menuItems={menuItems} />
              </div>
            )}
            <div className={`tw-my-${shouldRenderContent && !hideNavbar ? '16' : '0'}`}>
              {shouldRenderContent ? children : <Custom404 />}
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
