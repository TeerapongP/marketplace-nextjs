'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '../../../../components/Card'; // Adjust the import path as needed
import Alert from '../../../../components/Alert'; // Adjust the import path as needed
import Product from '../../../interface/products'; // Adjust the import path as needed
import Loading from '../../../../components/Loading';
import { useCart } from '../../../context/CartContext'; // Ensure this path is correct

const ProductPage = () => {
  const pathname = usePathname();
  const [shopId, setShopId] = useState<string | null>(null);
  const [data, setData] = useState<Product[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { dispatch } = useCart();

  useEffect(() => {
    const id = pathname.split('/').pop(); // Extract the dynamic parameter
    setShopId(id || null);

    if (id) {
      setLoading(true); // Start loading
      fetch(`/api/products?shopId=${id}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data); // Set fetched data
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setAlertMessage('Failed to load data');
          setAlertType('error');
          setLoading(false); // Stop loading
        });
    }
  }, [pathname]);

  const handleAddToCart = (product: Product) => {
    console.log("product ", product);
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity: 1 },
    });
    setAlertMessage('Product added to cart');
    setAlertType('success');
  };

  return (
    <div className="tw-w-full tw-mt-24">
      {loading ? (
        <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-full">
          <Loading />
        </div>
      ) : (
        <>
          {alertMessage && alertType && (
            <div className="tw-w-full tw-flex tw-justify-center tw-mb-4">
              <Alert type={alertType} message={alertMessage} />
            </div>
          )}
          <div className="tw-grid tw-gap-4 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5 tw-items-center tw-place-items-center">
            {data.length > 0 ? (
              data.map((item) => (
                <Card
                  key={item.productId}
                  title={item.productName}
                  content={item.description}
                  imageUrl={item.images}
                  bgColor="tw-bg-custom-yellow"
                  price={item.price}
                  bgButtonColor="tw-bg-custom-green"
                  onButtonClick={handleAddToCart}
                />
              ))
            ) : (
              <p>No products found</p> // You can add a fallback message
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
