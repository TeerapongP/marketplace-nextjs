'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '../../../../components/Card'; // Adjust the import path as needed
import Alert from '../../../../components/Alert'; // Adjust the import path as needed
import Product from '../../../interface/products'; // Adjust the import path as needed
import Loading from '../../../../components/Loading';
import { useCart } from '../../../context/CartContext'; // Ensure this path is correct
import { CartItem } from '@/app/interface/carts';
import CloseButton from '../../../../components/CloseButton'; // Ensure this path is correct

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


  useEffect(() => {
    const storedRoleId = localStorage.getItem('roleId');
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setRoleId(storedRoleId ? Number(storedRoleId) : null);

    const id = pathname.split('/').pop(); // Extract the dynamic parameter
    if (id) {
      const numericId = Number(id);
      setShopId(numericId); // Set the shopId based on the extracted ID
      fetchProducts(numericId); // Fetch products based on the new shopId
    }
  }, [pathname]);


  const fetchProducts = async (id: number) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`/api/products/fetch?shopId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setData(data); // Set fetched data
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
          shopName: '',
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
      const res = await fetch('/api/products/delete', {
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
        setAlertMessage('Delete shop successful');
        setAlertType('success');
      }
    } catch (error: any) {
      setAlertMessage('Delete failed');
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="tw-w-full tw-mt-24">
      {alertMessage && alertType && (
        <div className="tw-w-full tw-flex tw-justify-center tw-mb-4">
          <Alert type={alertType} message={alertMessage} />
        </div>
      )}
      <div className="tw-grid tw-gap-4 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5 tw-items-center tw-place-items-center">
        {data.length > 0 ? (
          <>
            {data.length > 0 && data.map((item) => (
              <div key={item.productId} className="tw-relative ">
                {(roleId === 3 || roleId === 1) && (
                  <div className='tw-mb-4'> {/* Shift CloseButton 2rem to the right */}
                    <CloseButton onClick={() => handleDeleteButtonClick(Number(item.productId))} />
                  </div>
                )}
                <Card
                  key={item.productId}
                  title={item.productName}
                  content={item.description}
                  imageUrl={item.images}
                  bgColor="tw-bg-custom-yellow"
                  price={item.price}
                  bgButtonColor="tw-bg-custom-green"
                  onButtonClick={() => handleAddToCart(item)}
                />
              </div>
            ))}

          </>
        ) : (
          <p>No products found</p> // Fallback message
        )}

      </div>
    </div>
  );
};

export default ProductPage;
