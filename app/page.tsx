'use client';
import { useEffect, useState } from 'react';
import SearchInput from '@/components/SearchInput';
import Card from '@/components/Card';
import Shop from './interface/shop';
import Alert from '@/components/Alert';
import { useRouter } from 'next/navigation'; // Import for client-side navigation
import { useCart } from './context/CartContext';
import CloseButton from '@/components/CloseButton';
import EditButton from '@/components/EditButton';
import Loading from '@/components/Loading';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [data, setData] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [imagesPath, setImagesPath] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const router = useRouter(); // Get the router instance
  const { state: { }, dispatch } = useCart();
  useEffect(() => {
    setImagesPath(process.env.NEXT_PUBLIC_LOCAL_BASE_URL ?? '');
    fetchCartItems();
    fetchShopAll();
    const storedRoleId = localStorage.getItem('roleId');
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setRoleId(storedRoleId ? Number(storedRoleId) : null);

    // Set up the alert message timeout
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000); // Hide alert after 3 seconds

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [dispatch, alertMessage]);

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
    } finally {
      setLoading(false);
    }
  };
  const fetchCartItems = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (userId && token) {
      try {
        const res = await fetch(`/api/carts/fetch?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          dispatch({ type: 'SET_CART_ITEMS', payload: data });
        } else {
          const errorMessage = (await res.json())?.message || 'Error fetching cart items';
          console.error(errorMessage);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    } else {
      console.error('User ID or token is missing');
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
          'Authorization': `Bearer ${token}`, // Include 'Bearer' in the header ปุ่มเปิดปิด
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
    }
  };

  const handleButtonClick = (shopId: number) => {
    router.push(`/pages/products/${shopId}`); // Perform client-side navigation กดปุ่มวิว
  };

  const handleDeleteButtonClick = async (shopId: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/shop/shop-delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shopId }),
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error('Failed to delete shop');
      }
      setLoading(false);
      await fetchShopAll();
      setAlertMessage('Delete shop successful');
      setAlertType('success');//200
    } catch (error: any) {
      if (error.message === 'Token expired') {
        setLoading(false);
        router.push('/pages/auth/login');//ถ้า token หมดอายุ ดีดไปหน้าล็อดอิน
      }
      setLoading(false);
      setAlertMessage('Delete failed');
      setAlertType('error');//500
    }
  };
  const handleEditButtonClick = async (shopId: number) => {
    router.push(`/pages/shop/shop-edit/${shopId}`);//ปุมแก้ไข
  }

  const handleClick = (value: string) => {
    if (value.trim() === '') {
      fetchShopAll(); //ถ้าไม่พิพม์อะไนขึ้นทุกร้าน
    }
  };
  return (
    loading ? (
      <Loading />
    ) : error ? (
      <Alert message={error} type={'error'} />
    ) : (
      <div className="tw-w-full">
        <div className="tw-grid sm:tw-mt-24 md:tw-mt-24 lg:tw-mt-24 custom-sm:tw-mt-24 custom-sm:tw-justify-items-center tw-justify-items-end tw-mr-20 custom-sm:tw-mr-0">
          <SearchInput onSearch={handleSearch} onClick={handleClick} />
        </div>

        <div className="tw-grid tw-gap-4 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5 tw-items-center tw-place-items-center">
          {data?.length > 0 ? (
            data.map((item) => {
              const isLocalImage = !item.shopImages.startsWith('http://') && !item.shopImages.startsWith('https://');
              const imageUrl = isLocalImage ? `${imagesPath}${item.shopImages}` : item.shopImages;

              return (
                <div key={item.shopId} className="tw-relative">
                  {(roleId === 3 || roleId === 1) && (
                    <div className="tw-my-4 tw-ms-5">
                      <CloseButton onClick={() => handleDeleteButtonClick(Number(item.shopId))} />
                      <EditButton onClick={() => handleEditButtonClick(Number(item.shopId))} />
                    </div>
                  )}
                  <Card
                    title={item.shopName}
                    content={item.shopDescription}
                    imageUrl={imageUrl}
                    shopId={Number(item.shopId)}
                    status={item.status}
                    roleId={Number(roleId)}
                    disabled={roleId === null}
                    onToggleChange={handleToggleChange}
                    onButtonViewClick={handleButtonClick}
                  />
                </div>
              );
            })
          ) : (
            <p>No shops available to display.</p>
          )}
        </div>

        {alertMessage && alertType && <Alert type={alertType} message={alertMessage} />}
      </div>
    )
  );
}