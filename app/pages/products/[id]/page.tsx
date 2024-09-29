'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../../../context/CartContext'; // Ensure this path is correct
import { CartItem } from '@/app/interface/carts';
import { useRouter } from 'next/navigation'; // Import for client-side navigation

import React from 'react';
import CloseButton from '@/components/CloseButton'; // Ensure this path is correct
import Card from '@/components/Card'; // Adjust the import path as needed
import Alert from '@/components/Alert'; // Adjust the import path as needed
import Product from '../../../interface/products'; // Adjust the import path as needed
import EditButton from '@/components/EditButton';
import Button from '@/components/Button';
import Loading from '@/components/Loading';

const ProductPage = () => {
  const pathname = usePathname();
  const [data, setData] = useState<Product[]>([]);
  const [shopId, setShopId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { state: { }, dispatch } = useCart();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter(); // Get the router instance
  const [images, setImages] = useState<string | null>(null);

  useEffect(() => {
    const storedRoleId = localStorage.getItem('roleId');
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setRoleId(storedRoleId ? Number(storedRoleId) : null);
  }, []);

  useEffect(() => {
    const id = pathname.split('/').pop(); // Extract the dynamic parameter
    if (id) {
      const numericId = Number(id);
      setShopId(numericId); // Set the shopId based on the extracted ID
      fetchProducts(numericId); // Fetch products based on the new shopId
    }
  }, [pathname]); // Fixed dependency array

  const fetchProducts = async (id: number) => {
    const basePath = process.env.NEXT_PUBLIC_LOCAL_BASE_URL || '';
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/products/product-list?shopId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const dataItem = await response.json();
      setData(dataItem.map((product: any) => ({
        ...product,
        images: product.images.startsWith('http://') || product.images.startsWith('https://')
          ? product.images
          : `${basePath}${product.images}`,
      }))); // Set fetched data
    } catch (error) {
      setAlertMessage('Failed to load data');
      setAlertType('error');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    const userId = localStorage.getItem('userId');

    if (!userId || !token) {
      setAlertMessage('You need to be logged in to add items to the cart.');
      setAlertType('error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/carts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(userId),
          productId: product.productId,
          quantity,
        }),
      });

      if (res.ok) {
        const cartItem: CartItem = {
          productId: product.productId,
          productName: product.productName,
          description: product.description,
          price: product.price,
          quantity,
          stock: product.stock,
          images: product.images,
          shopName: '', // Add shop name if applicable
        };

        // Dispatch the action to add the item to the cart
        dispatch({ type: 'ADD_TO_CART', payload: cartItem });
        setAlertMessage('Product added to cart');
        setAlertType('success');
      } else {
        const errorMessage = (await res.json())?.message || 'Something went wrong. Please try again.';
        setAlertMessage(errorMessage);
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('An unexpected error occurred. Please try again later.');
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteButtonClick = async (productId: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/products/product-delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        setAlertMessage(message);
        setAlertType(res.status === 400 ? 'warning' : 'error');
      } else {
        await fetchProducts(Number(shopId));
        setAlertMessage('Delete successful');
        setAlertType('success');
      }
    } catch (error: any) {
      setAlertMessage('Delete failed');
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditButtonClick = async (productId: number) => {
    router.push(`/pages/products/product-edit/${productId}`);
  };

  const handleAddButtonClick = (shopId: number) => {
    router.push(`/pages/products/product-create/${shopId}`);
  };

  return (
    <div className="tw-mt-20 tw-mx-20">
      {loading ? (
        <div><Loading /></div>
      ) : (
        <>
          <div className="tw-flex tw-justify-end tw-mt-4 tw-mr-20">
            <Button
              type="button"
              text="เพิ่มสินค้า"
              width="tw-w-full sm:tw-w-auto"  // Adjust width for smaller screens
              textColor="tw-text-white"
              color="tw-bg-blue-700"
              onClick={() => handleAddButtonClick(Number(shopId))}
            />
          </div>

          <div className='tw-w-full'>
            <div className="tw-grid tw-gap-4 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5 tw-items-center tw-place-items-center">
              {data.length > 0 ? (
                data.map((item) => (
                  <div key={item.productId} className="tw-relative">
                    {(roleId === 3 || roleId === 1) && (
                      <div className="tw-mb-4">
                        <CloseButton onClick={() => handleDeleteButtonClick(Number(item.productId))} />
                        <EditButton onClick={() => handleEditButtonClick(Number(item.productId))} />
                      </div>
                    )}
                    <Card
                      title={item.productName}
                      content={item.description}
                      imageUrl={item.images || ''} // Fallback image if none exists
                      bgColor="tw-bg-custom-yellow"
                      price={item.price}
                      bgButtonColor="tw-bg-custom-green"
                      onButtonClick={() => handleAddToCart(item)}
                    />
                  </div>
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          </div>
        </>
      )}
      {alertMessage && alertType && (
        <Alert type={alertType} message={alertMessage} />
      )}
    </div>
  );
};

export default ProductPage;
