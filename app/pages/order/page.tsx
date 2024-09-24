'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext'; // Adjust the path as necessary
import Alert from '@/components/Alert'; // Adjust path as necessary
import Loading from '@/components/Loading'; // Adjust path as necessary
import Button from '@/components/Button';
import { useRouter } from 'next/navigation'; // Import for client-side navigation
import TextInput from '@/components/Input';

const OrderPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const { state: { cartItems }, dispatch } = useCart();
  const router = useRouter(); // Get the router instance

  const [shipmentInfo, setShipmentInfo] = useState({
    name: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

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
          setAlertMessage(errorMessage);
          setAlertType('error');
        }
      } catch (error) {
        setAlertMessage(`ERROR: ${error}`);
        setAlertType('error');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const orderData = {
      userId: userId,
      orderItems: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        totalPrice: item.price, // Make sure to get the correct price
      })),
      totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      shipment: {
        ...shipmentInfo,
      },
    };
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      setAlertMessage('Order placed successfully!');
      setAlertType('success');
      router.push('/');
    } catch (error) {
      console.error('Error placing order:', error);
      setAlertMessage('Failed to place order.');
      setAlertType('error');
    } finally {
      setLoading(false);
    }
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
              const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
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
                    <div>{totalPrice.toFixed(2)} Baht</div>
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
          <div className="tw-grid tw-gap-4 tw-mb-4 md:tw-grid-cols-2">
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Name</label>
              <TextInput
                type="text"
                id="name"
                value={shipmentInfo.name}
                onChange={(e) => setShipmentInfo(prevState => ({ ...prevState, name: e.target.value }))} // Inline update
                required
                placeholder="Enter your first name"
                className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500"
              />
            </div>
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Last Name</label>
              <TextInput
                type="text"
                id="lastName"
                value={shipmentInfo.lastName}
                onChange={(e) => setShipmentInfo(prevState => ({ ...prevState, lastName: e.target.value }))} // Inline update
                required
                placeholder="Enter your last name"
                className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500"
              />
            </div>
          </div>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Address</label>
            <TextInput
              type="text"
              id="address"
              value={shipmentInfo.address}
              onChange={(e) => setShipmentInfo(prevState => ({ ...prevState, address: e.target.value }))} // Inline update
              required
              placeholder="Enter your address"
              className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500"
            />
          </div>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">City</label>
            <TextInput
              type="text"
              id="city"
              value={shipmentInfo.city}
              onChange={(e) => setShipmentInfo(prevState => ({ ...prevState, city: e.target.value }))} // Inline update
              required
              placeholder="Enter your city"
              className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500"
            />
          </div>
          <div className="tw-grid tw-gap-4 tw-mb-4 md:tw-grid-cols-2">
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">State</label>
              <TextInput
                type="text"
                id="state"
                value={shipmentInfo.state}
                onChange={(e) => setShipmentInfo(prevState => ({ ...prevState, state: e.target.value }))} // Inline update
                required
                placeholder="Enter your state"
                className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500"
              />
            </div>
            <div>
              <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Zip Code</label>
              <TextInput
                type="text"
                id="zipCode"
                value={shipmentInfo.zipCode}
                onChange={(e) => setShipmentInfo(prevState => ({ ...prevState, zipCode: e.target.value }))} // Inline update
                required
                maxLength={5}
                placeholder="Enter your zip code"
                className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500"
              />
            </div>
          </div>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">Country</label>
            <TextInput
              type="text"
              id="country"
              value={shipmentInfo.country}
              onChange={(e) => setShipmentInfo(prevState => ({ ...prevState, country: e.target.value }))} // Inline update
              required
              placeholder="Enter your country"
              className="tw-border tw-border-gray-300 tw-p-2 tw-w-full tw-rounded hover:tw-border-blue-500 focus:tw-border-blue-500"
            />
          </div>
          <Button type="submit" className="tw-w-full tw-bg-blue-600 tw-text-white tw-p-2 tw-rounded hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500">
            Place Order
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
