'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext'; // Adjust the path as necessary
import Alert from '@/components/Alert'; // Adjust path as necessary
import Loading from '@/components/Loading'; // Adjust path as necessary

const OrderPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const { state: { cartItems }, dispatch } = useCart();

  useEffect(() => {
    fetchCartItems();
  }, [dispatch]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Handle order submission logic here

    // On success
    setAlertMessage('Order placed successfully!');
    setAlertType('success');
    setLoading(false);

    // On error
    // setAlertMessage('Error placing order.');
    // setAlertType('error');
  };

  // Group items by shopName
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) {
      acc[item.shopName] = [];
    }
    acc[item.shopName].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  return (
    <div className="tw-container tw-mx-auto tw-py-10 tw-mt-10">
      <h1 className="tw-text-3xl tw-font-bold tw-text-center tw-mb-8">
        <i className="fas fa-shopping-cart tw-mr-2"></i>
        Order Confirmation
      </h1>
      {loading && <Loading />}

      {alertMessage && alertType && (
        <div className="tw-w-full tw-flex tw-justify-center tw-mb-4">
          <Alert type={alertType} message={alertMessage} />
        </div>
      )}

      <div className="tw-grid tw-gap-6 md:tw-grid-cols-2">
        {/* Order Details */}
        <div className="tw-p-6 tw-bg-gray-50 tw-shadow-lg tw-rounded-lg">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-blue-600">
            <i className="fas fa-receipt tw-mr-2"></i>
            Order Details
          </h2>
          {Object.keys(groupedItems).length === 0 ? (
            <div className="tw-text-gray-500">No items in the cart</div>
          ) : (
            Object.entries(groupedItems).map(([shopName, items], index) => {
              const totalPrice = items.reduce((total, item) => total + item.price, 0);
              const backgroundColor = index % 2 === 0 ? 'tw-bg-blue-100' : 'tw-bg-green-100'; // Alternate colors
              return (
                <div key={shopName} className={`tw-mb-6 ${backgroundColor} tw-p-4 tw-rounded-lg`}>
                  <h3 className="tw-font-semibold tw-text-lg tw-text-gray-800">{shopName}</h3>
                  {items.map(item => (
                    <div key={item.productId} className="tw-flex tw-justify-between tw-border-b tw-pb-2 tw-mb-2 tw-text-gray-700">
                      <div>{item.productName}</div>
                      <div>Price: {item.price} Baht</div>
                    </div>
                  ))}
                  <div className="tw-flex tw-justify-between tw-font-bold tw-mt-4 tw-text-gray-900">
                    <div>Total:</div>
                    <div>{totalPrice} Baht</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Shipping Information */}
        <form onSubmit={handleSubmit} className="tw-p-6 tw-bg-white tw-shadow-lg tw-rounded-lg">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-blue-600">
            <i className="fas fa-shipping-fast tw-mr-2"></i>
            Shipping Information
          </h2>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Name</label>
            <input type="text" required className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500" />
          </div>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Address</label>
            <input type="text" required className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500" />
          </div>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">City</label>
            <input type="text" required className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500" />
          </div>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Postal Code</label>
            <input type="text" required className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500" />
          </div>

          {/* Payment Options */}
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-blue-600">
            <i className="fas fa-credit-card tw-mr-2"></i>
            Payment Method
          </h2>
          <div className="tw-flex tw-items-center tw-mb-4">
            <input type="radio" id="creditCard" name="payment" value="creditCard" className="tw-mr-2" required />
            <label htmlFor="creditCard">Credit Card</label>
          </div>
          <div className="tw-flex tw-items-center tw-mb-4">
            <input type="radio" id="paypal" name="payment" value="paypal" className="tw-mr-2" required />
            <label htmlFor="paypal">PayPal</label>
          </div>

          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-py-2 tw-px-4 tw-rounded hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500">
            <i className="fas fa-check-circle tw-mr-2"></i>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
