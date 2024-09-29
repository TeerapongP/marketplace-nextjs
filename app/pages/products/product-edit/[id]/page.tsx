"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Shop } from '@prisma/client';
import { useRouter } from 'next/navigation';

import Alert from '../../../../../components/Alert';
import FileInput from "@/components/FileInput";
import TextInput from '@/components/Input';
import Button from '@/components/Button';
import Loading from "@/components/Loading";
import Dropdown from '@/components/Dropdown';
import { set } from 'date-fns';

const ProductEditPage = () => {
  const pathname = usePathname();
  const [data, setData] = useState<Shop | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productName, setProductName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productStock, setProductStock] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [shopId, setShopId] = useState<number | null>(null);
  const [imagesPath, setImagesPath] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setImagesPath(process.env.NEXT_PUBLIC_LOCAL_BASE_URL || '');
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    const id = pathname.split('/').pop();
    if (id) {
      const numericId = Number(id);
      setProductId(numericId);
    }
  }, [pathname]);

  useEffect(() => {
    if (productId && token) {
      fetchShop(productId);
    }
  }, [productId, token, categoryId, shopId]);

  const fetchShop = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/product-find-by-id?productId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch shop data');
      }
      const data = await res.json();

      const isLocalImage = !data.images.startsWith('http://') && !data.images.startsWith('https://');
      const imageUrl = isLocalImage ? `${imagesPath}${data.images}` : data.images;
      console.log(imageUrl);

      setData(data);
      setProductId(data.productId);
      setProductImages(imageUrl || []);
      setProductName(data.productName || '');
      setProductDescription(data.description || '');
      setProductPrice(data.price || '');
      setProductStock(data.stock || '');
      setShopId(data.shopId);
      setCategoryId(data.categoryId);
    } catch (error) {
      setAlertMessage('Failed to load data');
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = React.useCallback((selectedCategoryId: number) => {
    setCategoryId(selectedCategoryId);
  }, []);

  const handleFileUpload = (files: File[]) => {
    setProductImages(files);
  };

  const handleProductNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.currentTarget.value),
    []
  );

  const handleProductDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductDescription(e.target.value);
  };

  const handleProductPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductPrice(e.target.value);
  };

  const handleProductStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductStock(e.target.value);
  };

  const handleReset = () => {
    setProductImages([]);
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductStock('');
    setAlertMessage(null);
    setAlertType(null);
    setCategoryId(null); // Reset categoryId on reset
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('productId', String(productId));
    formData.append('productName', productName);
    formData.append('description', productDescription);
    formData.append('price', String(productPrice));
    formData.append('stock', String(productStock));
    formData.append('categoryId', String(categoryId));
    formData.append('shopId', String(shopId));

    if (productImages.length > 0) {
      for (let i = 0; i < productImages.length; i++) {
        formData.append('images', productImages[i]); // Append the file object
      }
    }
    try {

      const res = await fetch('/api/products/product-update', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to update product');
      }
      router.push('/');
      setAlertMessage('Product updated successfully!');
      setAlertType('success');
    } catch (error) {
      setAlertMessage('Failed to update product');
      setAlertType('error');
    }
  }

  return (
    <div className='tw-mt-20 tw-mx-20'>
      {loading ? (
        <div><Loading /></div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="tw-flex tw-justify-center tw-my-10">
              <FileInput onFileChange={handleFileUpload} value={productImages} />
            </div>
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-1 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
                <div>
                  <span>Product Name</span>
                  <TextInput
                    type="text"
                    id="productName"
                    required
                    className="tw-w-full"
                    value={productName}
                    onChange={handleProductNameChange}
                  />
                </div>
              </div>
              <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
                <div>
                  <span>Product Description</span>
                  <TextInput
                    type="text"
                    required
                    className="tw-w-full"
                    value={productDescription}
                    onChange={handleProductDescriptionChange}
                  />
                </div>

                <div className='tw-mt-[-0.3rem]'>
                  <span>Select Category</span>
                  <Dropdown
                    url="/api/category"
                    onSelect={handleSelect}
                    valueString="categoryId,name"
                    keyString="categoryId,name"
                    disable={true}
                    placeholder="Select a Category"
                    value={categoryId}
                  />
                </div>
              </div>
              <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
                <div>
                  <span>Product Price</span>
                  <TextInput
                    type="number"
                    required
                    className="tw-w-full"
                    value={productPrice}
                    onChange={handleProductPriceChange}
                  />
                </div>
                <div>
                  <span>Product Stock</span>
                  <TextInput
                    type="number"
                    required
                    className="tw-w-full"
                    value={productStock}
                    onChange={handleProductStockChange}
                  />
                </div>
              </div>
              <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-10 tw-w-1/2">
                <div>
                  <Button
                    type="submit"
                    text="Save"
                    width="tw-w-full"
                    textColor="tw-text-white"
                    color="tw-bg-blue-700"
                  />
                </div>
                <div>
                  <Button
                    type="button"
                    text="Reset"
                    width="tw-w-full"
                    textColor="tw-text-white"
                    color="tw-bg-red-700"
                    onClick={handleReset}
                  />
                </div>
              </div>
            </div>
          </form>
          {alertMessage && alertType && (
            <Alert type={alertType} message={alertMessage} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductEditPage;
