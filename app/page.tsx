'use client';
import { useEffect, useState } from 'react';
import SearchInput from '../components/SearchInput';
import Card from '../components/Card';
import Loading from '../components/Loading';
import Shop from './interface/shop';
import Alert from '../components/Alert';
import router from 'next/router';

export default function Home() {
  const [data, setData] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);

  useEffect(() => {
    fetchShopAll();

    const storedRoleId = localStorage.getItem('roleId');
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setRoleId(storedRoleId ? Number(storedRoleId) : null);
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000); // Hide alert after 3 seconds

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [alertMessage]);

  const fetchShopAll = async () => {
    try {
      const res = await fetch('/api/shop/shop-list');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Shop[] = await res.json();
      setData(data);
    } catch (error) {
      setError('Error fetching shop list');
      console.error('Error fetching shop list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    setData([]);
    setLoading(true);

    try {
      if (value.trim() === '') {
        await fetchShopAll();
      } else {
        const encodedValue = encodeURIComponent(value);
        const res = await fetch(`/api/shop/shop-find-by-name?shopName=${encodedValue}`, {
          method: 'GET',

        });
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }

        const data: Shop[] = await res.json();
        setData(data);
      }
    } catch (error) {
      setError(`Error fetching search results`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = async (shopId: number, checked: boolean) => {
    if (2 === roleId || null === roleId) {
      return;
    }

    try {
      const response = await fetch('/api/shop/status-shop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shopId: shopId,
          status: checked,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      await fetchShopAll();
      setAlertMessage('Update successful');
      setAlertType('success');
    } catch (error: any) {
      if (error.message === 'Token expired') {
        router.push('/pages/auth/login'); // Redirect to a protected route
      }
      setAlertMessage('Update failed');
      setAlertType('error');
      console.error('Error updating status:', error);
    }
  };

  const handleClick = (value: string) => {
    if (value.trim() === '') {
      fetchShopAll();
    }
  };
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='tw-w-full'>
      <div className='tw-grid sm:tw-mt-24 md:tw-mt-24 lg:tw-mt-24 custom-sm:tw-mt-24 custom-sm:tw-justify-items-center tw-justify-items-end tw-mr-20 custom-sm:tw-mr-0'>
        <SearchInput onSearch={handleSearch} onClick={handleClick} />
      </div>
      <div className='tw-grid tw-gap-4 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5 tw-items-center tw-place-items-center'>
        {data.length > 0 && data.map((item) => (
          <Card
            key={item.shopId}
            title={item.shopName}
            content={item.shopDescription}
            imageUrl={item.shopImages}
            shopId={Number(item.shopId)}
            status={item.status}
            disabled={null == roleId ? true : false}
            onToggleChange={handleToggleChange}
          />
        ))}
      </div>
      {alertMessage && alertType && (
        <Alert type={alertType} message={alertMessage} />
      )}
    </div>
  );
}
