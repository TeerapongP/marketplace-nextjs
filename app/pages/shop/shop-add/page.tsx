"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Alert from '../../../../components/Alert';
import FileInput from "@/components/FileInput";
import ToggleSwitch from '@/components/Toggle';
import TextInput from '@/components/Input';
import Button from '@/components/Button';
import { Shop } from '@prisma/client';
import { useRouter } from 'next/navigation'; // Import for client-side navigation
import Loading from "@/components/Loading";

const ShopEditPage = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [shopImages, setShopImages] = useState<File[]>([]);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [shopName, setShopName] = useState<string>('');
  const [shopDescription, setShopDescription] = useState<string>('');
  const router = useRouter();

  const handleToggleChange = (checked: boolean) => {
    setIsToggled(checked);
  };

  const handleFileUpload = (files: File[]) => {
    setShopImages(files);
  };

  const handleShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopName(e.target.value);
  };

  const handleShopDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopDescription(e.target.value);
  };

  const handleReset = () => {
    setShopImages([]);
    setIsToggled(false);
    setShopName('');
    setShopDescription('');
    setAlertMessage(null);
    setAlertType(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('shopName', shopName);
    formData.append('shopDescription', shopDescription);
    formData.append('status', String(isToggled));
    formData.append('userId', userId || '');

    if (shopImages.length > 0) {
      for (let i = 0; i < shopImages.length; i++) {
        formData.append('shopImages', shopImages[i]);
      }
    }
    try {
      const res = await fetch('/api/shop/shop-create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to shop create');
      }
      setLoading(false);
      router.push('/');
      setAlertMessage('Shop create successfully!');
      setAlertType('success');
    } catch (error) {
      setLoading(false);
      setAlertMessage('Failed to shop create');
      setAlertType('error');
    }
  }
  return (
    <div className='tw-mt-20 tw-mx-20'>
      (
      <>
        <form onSubmit={handleSubmit}>

          <div className="tw-flex tw-justify-center tw-my-10">

            <FileInput onFileChange={handleFileUpload} value={shopImages} />
          </div>
          <div className="tw-flex tw-flex-col tw-justify-center tw-items-center">
            <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-1 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
              <div>
                <span>Shop Name</span>
                <TextInput
                  type="text"
                  id="shopName"
                  required
                  className="tw-w-full"
                  value={shopName}
                  onChange={handleShopNameChange}
                />
              </div>
            </div>
            <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
              <div>
                <span>Shop Description</span>
                <TextInput
                  type="text"
                  required
                  className="tw-w-full"
                  value={shopDescription}
                  onChange={handleShopDescriptionChange}
                />
              </div>
              <div className='tw-mt-2 tw-mx-5'>
                <span>Shop Status</span>
                <ToggleSwitch
                  label={isToggled ? 'open' : 'close'}
                  checked={isToggled}
                  onChange={handleToggleChange}
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
      )
    </div>
  );
};

export default ShopEditPage;
