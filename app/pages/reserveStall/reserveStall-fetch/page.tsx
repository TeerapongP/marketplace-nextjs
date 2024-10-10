'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagesPath, setImagesPath] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const router = useRouter();

  useEffect(() => {
    setImagesPath(process.env.NEXT_PUBLIC_LOCAL_BASE_URL ?? '');
    fetchSpaceMarket();
  }, []);

  const fetchSpaceMarket = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await fetch(`/api/reserveStall/reserveStall-fetch`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setAlertMessage('Failed to fetch data');
        throw new Error('Failed to fetch data');
      }
      setLoading(false);
      const data = await response.json();
      setData(data);
      setAlertMessage('Fetch data successfully');
    } catch (error) {
      setAlertMessage('Failed to fetch data');
      setLoading(false);
    }
  };

  const openModal = (item: any) => {
    setSelectedProduct(item);
    setIsModalOpen(true);  // Open the modal
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirm = async (productId: number) => {

  };

  const getButtonColor = (alphabeticPart: string): string => {
    if (alphabeticPart === "A") {
      return "tw-bg-blue-500";
    } else if (alphabeticPart === "C") {
      return "tw-bg-green-500";
    } else if (alphabeticPart === "B") {
      return "tw-bg-red-500";
    } else {
      return "tw-bg-yellow-500"; // Default color
    }
  };

  return (
    loading ? <Loading /> :
      <div className="tw-h-auto tw-max-h-screen tw-bg-custom-yellow tw-flex tw-flex-col tw-justify-between tw-mt-24 tw-mx-10">
        <div className="tw-grid tw-pt-5 tw-justify-items-end tw-mx-5 sm:tw-mx-10">
          <Button
            type="submit"
            text="แก้ไข้แผงตลาด"
            width="tw-w-[10vw]"
            textColor="tw-text-white"
            color="tw-bg-blue-700"
            onClick={() => router.push('/reserveStall/reserveStall-edit')}
          />
        </div>

        <div className='tw-relative tw-flex-1'>
          <div className='tw-flex tw-justify-between tw-py-10'>
            <div className="tw-grid tw-grid-roles-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 xl:tw-grid-cols-8 tw-h-auto tw-max-h-[90vh]">
              {data.length > 0 && data.map((item) => {
                const alphabeticPart = item.spaceLocation.match(/^[A-Z]+/);
                const buttonColor = alphabeticPart ? getButtonColor(alphabeticPart[0]) : "tw-bg-gray-500";
                return (
                  <div key={item.spaceId} className="tw-ml-10 tw-my-4 tw-h-[7vh]">
                    <Button
                      type="button"
                      text={`${item.spaceLocation}`}
                      width="tw-w-[10vw] tw-h-full"
                      textColor="tw-text-white"
                      color={buttonColor}
                      onClick={() => openModal(item)}
                    />
                  </div>
                );
              })}
            </div>
            <div className='tw-w-[3vw] tw-h-[90vh] tw-bg-gray-300 tw-mx-10 tw-flex tw-justify-center tw-items-center'>
              <span className='tw-text-4xl -tw-rotate-90'>ถนน</span>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="ยืนยันการจองแผงตลาด"
          footer={
            <div className="tw-flex tw-justify-center tw-w-full tw-py-2">
              <div className="tw-mx-2">
                <Button
                  type="button"
                  text="Close"
                  width="tw-w-[10vw] tw-max-w-[150px]"
                  textColor="tw-text-white"
                  color="tw-bg-gray-600"
                  onClick={closeModal}
                />
              </div>
              <div className="tw-mx-2">
                <Button
                  type="button"
                  text="Confirm"
                  width="tw-w-[10vw] tw-max-w-[150px]"
                  textColor="tw-text-white"
                  color="tw-bg-blue-600"
                  onClick={() => handleConfirm(selectedProduct)}
                />
              </div>
            </div>
          }
        >
          {selectedProduct && (
            <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-p-4">
              {(() => {
                const isLocalImage = !selectedProduct.images.startsWith('http:') && !selectedProduct.images.startsWith('https:');
                const imageUrl = isLocalImage ? `${imagesPath}${selectedProduct.images}` : selectedProduct.images;
                console.log('Image URL:', imageUrl); // Check the URL
                return (
                  <>
                    <p>ยืนยันการจองแผงตลาดสำหรับ {selectedProduct.spaceLocation}</p>
                    <p>ราคาต่อวัน: {selectedProduct.pricePerDay} Baht</p>
                    <div className="tw-relative tw-w-full tw-h-64"> {/* Set a height for the parent */}
                      <Image
                        src={imageUrl}
                        alt={selectedProduct.spaceLocation ?? ''}
                        layout="fill"
                        className="tw-object-cover"
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </Modal>
        {alertMessage && alertType && (
          <Alert type={alertType} message={alertMessage} />
        )}
      </div>
  );
}