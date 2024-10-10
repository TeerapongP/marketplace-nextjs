'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Card from '@/components/Card';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagesPath, setImagesPath] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        throw new Error('Failed to fetch deliveries');
      }
      setLoading(false);
      const data = await response.json();
      setData(data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-6 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5 tw-items-center tw-place-items-center'>
      {data.length > 0 && data.map((item) => {
        const isLocalImage = !item.images.startsWith('http://') && !item.images.startsWith('https://');
        const imageUrl = isLocalImage ? `${imagesPath}${item.images}` : item.images;
        return (
          <div key={item.spaceId} className="tw-relative tw-my-10">
            <Card
              title={item.spaceLocation}
              price={item.pricePerDay}
              imageUrl={imageUrl}
              onButtonClick={openModal}
            />
          </div>
        );
      })}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Modal Title"
        footer={
          <div className="tw-flex tw-justify-end">
            <button
              onClick={closeModal}
              className="tw-bg-gray-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-gray-700 tw-mr-2"
            >
              Close
            </button>
            <button className="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-blue-700">
              Confirm
            </button>
          </div>
        }
      >
        <p>This is the modal content. You can put any content here.</p>
      </Modal>
    </div>
  );
}
