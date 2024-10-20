'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Dropdown from '@/components/Dropdown';
import Card from '@/components/Card';
import Product from '../../interface/products';
import Loading from "@/components/Loading";
import Alert from '@/components/Alert';

const Category = () => {
  // Moved useState inside the component
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [imagesPath, setImagesPath] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleSelect = useCallback((selectedCategoryId: number) => {
    setCategoryId(selectedCategoryId); // Update the categoryId state
    fetchProductsByCategoryId(selectedCategoryId); // Use the selectedCategoryId directly
  }, []); // Keep the dependency array empty or add other dependencies if needed

  useEffect(() => {
    setImagesPath(process.env.NEXT_PUBLIC_LOCAL_BASE_URL ?? '');
    if (!categoryId) {
      fetchProducts();
    }
  }, [categoryId]); // Only run once on mount

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products/product-list', {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data: Product[] = await res.json();
      setData(data);
    } catch (error) {
      setAlertMessage('Error fetching products');
      setAlertType("error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchProductsByCategoryId = async (categoryId: number | null) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/product-find-by-categoryId?categoryId=${categoryId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setAlertMessage('Error fetching products');
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div><Loading /></div>
      ) : (
        <>
          <div className='tw-mx-auto tw-my-20 tw-w-[50vw] sm:tw-w-[100vw] md:tw-w-[50vw]'>
            <Dropdown
              url="/api/category"
              onSelect={handleSelect}
              valueString="categoryId,name"
              keyString="categoryId,name"
              disable={false}
              placeholder="เลือกหมวดหมู่สินค้า"
              value={categoryId}
            />
          </div>
          <div className='tw-grid tw-gap-4 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5 tw-items-center tw-place-items-center'>
            {data.length > 0 ? (
              data.map((item) => {
                const isLocalImage = !item.images.startsWith('http://') && !item.images.startsWith('https://');
                const imageUrl = isLocalImage ? `${imagesPath}${item.images}` : item.images;
                return (
                  <div key={item.productId} className="tw-relative">
                    <Card
                      title={item.productName}
                      content={item.description}
                      imageUrl={imageUrl}
                      hideButton={true}
                    />
                  </div>
                );
              })
            ) : (
              <div className="tw-text-center tw-mt-4">No Products Available</div> // Message to show when there are no products
            )}
          </div>
          {alertMessage && alertType && (
            <Alert type={alertType} message={alertMessage} />
          )}
        </>
      )}

    </>
  );
};

export default Category;
