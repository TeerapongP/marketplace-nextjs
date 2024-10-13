'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Alert from '@/components/Alert';
import DataTable from '@/components/Table';
import { ReserveSpaceColumns } from '@/app/constant/reserve-space-columns';
import TextInput from '@/components/Input';
import FileInput from '@/components/FileInput';
import ToggleSwitch from '@/components/Toggle';


export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const [itemTable, setItemTable] = useState<any[]>([]);
  const [spaceLocation, setSpaceLocation] = useState('');
  const [price, setPrice] = useState(0);
  const router = useRouter();
  const [isToggled, setIsToggled] = useState<boolean>(false);


  useEffect(() => {
    fetchSpaceMarket();
  }, []);

  const fetchSpaceMarket = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/reserveSpace/reserveSpace-fetch`, {
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
    setItemTable(item);
    setItemTable(item);
    setIsModalOpen(true);  // Open the modal
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setItemTable([]);
  };
  const handleDelete = async (itemTable: any) => {
    setLoading(true); // Start loading before the fetch call
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/reserveSpace/reserveSpace-delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure the content type is set
        },
        body: JSON.stringify({ reserveSpaceId: itemTable.reserveSpaceId, spaceId: itemTable.spaceId }), // Correctly pass the ID
      });

      if (!response.ok) {
        throw new Error('Failed to delete Space');
      }
      // Fetch space market data after successful deletion
      await fetchSpaceMarket();
      setAlertMessage('Delete Space successful');
      setAlertType('success');
    } catch (error: any) {
      if (error.message === 'Token expired') {
        router.push('/pages/auth/login'); // Redirect if the token is expired
      } else {
        setAlertMessage('Delete failed');
        setAlertType('error');
      }
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem('token');
    try {
      console.log(spaceLocation, price, isToggled);

      const response = await fetch('/api/reserveSpace/reserveSpace-add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure the content type is set
        },
        body: JSON.stringify({ spaceLocation: spaceLocation, pricePerDay: price, status: isToggled }), // Correctly pass the ID
      });

      if (!response.ok) {
        throw new Error('Failed to space');
      }
      await fetchSpaceMarket();
      setAlertMessage('Create space successful');
      setAlertType('success');
      closeModal();
    } catch (error: any) {
      if (error.message === 'Token expired') {
        router.push('/pages/auth/login'); // Redirect if the token is expired
      } else {
        setAlertMessage('Reserve space failed');
        setAlertType('error');
      }
    }
  };

  const handleToggleChange = (checked: boolean) => {
    setIsToggled(checked);
  };

  return (
    loading ? <Loading /> :
      <>
        <div className='tw-w-full'>
          <div className="tw-grid tw-pt-5 tw-justify-items-end tw-mx-6 sm:tw-mx-10">
            <Button
              type="button"
              text="เพิ่มแผงร้านค้า"
              width="tw-w-[10vw]"
              textColor="tw-text-white"
              color="tw-bg-blue-700"
              onClick={() => openModal({})}
            />
          </div>
          <div className='tw-w-[100vw] tw-px-10 tw-my-20'>
            <DataTable data={data} column={ReserveSpaceColumns} onDelete={handleDelete} />
            {
              alertMessage && alertType && (
                <Alert type={alertType} message={alertMessage} />
              )
            }
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="เพิ่มแผงในตลาด"
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
                  onClick={() => handleConfirm()}
                />
              </div>
            </div>
          }
        >
          <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center tw-p-4">
            <div className="tw-relative tw-w-full tw-h-64 tw-px-5">
              <div className="tw-mx-5">
                <label htmlFor="spaceLocation" className="tw-text-lg tw-text-gray-500">ตำแหน่งของแผง</label>
                <TextInput
                  type="text"
                  id="spaceLocation"
                  value={spaceLocation}
                  onChange={(e) => setSpaceLocation(e.target.value)}
                  required
                  placeholder="ตำแหน่งของแผง"
                  className="tw-w-full tw-mt-2 tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm tw-focus:outline-none tw-focus:ring tw-focus:ring-purple-400"
                />
              </div>
              <div className="tw-mx-5 tw-my-5">
                <label htmlFor="pricePerDay" className="tw-text-lg tw-text-gray-500">ราคาต่อวัน</label>
                <TextInput
                  type="text"
                  id="pricePerDay"
                  value={String(price)}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  placeholder="ราคาต่อวัน"
                  className="tw-w-full tw-mt-2 tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm tw-focus:outline-none tw-focus:ring tw-focus:ring-purple-400"
                />
              </div>
              <div className="tw-mx-5 tw-my-5">
                <label htmlFor="pricePerDay" className="tw-text-lg tw-text-gray-500">สถานะ</label>
                <ToggleSwitch
                  label={isToggled ? 'ไม่ว่าง' : 'ว่าง'}
                  checked={isToggled}
                  onChange={handleToggleChange}
                />

              </div>


            </div>
          </div>
        </Modal>

      </>
  );
}