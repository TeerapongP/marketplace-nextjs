'use client';

import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import React from 'react';
import Loading from '@/components/Loading'; // Adjust path as necessary
import TextInput from '@/components/Input';
import Button from '@/components/Button';
import Alert from '@/components/Alert';

const DeliveriesPage: NextPage = () => {
    const [trackingNumber, setTrackingNumber] = useState<string>('');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

    // Function to fetch deliveries based on the tracking number
    const fetchTrackingNumber = async (trackingNumber: string) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        setLoading(true);
        if (!trackingNumber || trackingNumber.length < 17) {
            setData([]);
            return;
        }
        try {
            const response = await fetch(`/api/deliveries/fetchTrackingNumber/?trackingNumber=${trackingNumber}&userId=${userId}`, {
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
            setAlertMessage('Deliveries fetched successfully!');
            setAlertType('success');
        } catch (error) {
            setLoading(false);
            setAlertMessage(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setAlertType('error');
        }
    };
    const generateDates = (date: string, numberOfDays: number, index: number) => {
        const initialDate = new Date(date);
        const datesArray = Array.from({ length: numberOfDays }, (_, i) => new Date(initialDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        return datesArray[index];
    };

    const extractTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
    };

    const generateRandomTime = () => {
        const randomTime = Math.floor(Math.random() * 24 * 60 * 60 * 1000);
        const date = new Date(randomTime);
        return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <>
            <div className='tw-grid tw-w-full tw-mx-5 tw-mt-16'>
                <div className="tw-flex  tw-justify-center tw-items-start tw-h-screen tw-p-4">
                    <div className="tw-w-full sm:tw-w-3/5 tw-rounded-lg tw-p-4 tw-grid-cols-2">
                        <div className="tw-flex tw-justify-center tw-flex-wrap">
                            <div className="tw-w-full sm:tw-w-2/5 tw-mb-2 sm:tw-mb-0">
                                <TextInput
                                    type="text"
                                    id="trackingNumber"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    required
                                    placeholder="กรอกเลขพัสดุ"
                                    className="tw-bg-white tw-text-gray-500 tw-rounded-full tw-w-full tw-px-4 tw-py-2 tw-outline-none"
                                />
                            </div>
                            <div className="tw-w-full sm:tw-w-1/5 sm:tw-mx-5 sm:tw-my-0">
                                <Button
                                    text="ติดตาม"
                                    className="tw-bg-gray-800 tw-mt-1 tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-w-full"
                                    onClick={() => fetchTrackingNumber(trackingNumber)}
                                />
                            </div>
                        </div>
                        <div className='tw-mt-10'>
                            <div className="tw-w-full tw-h-full tw-max-w-md tw-mx-auto tw-py-6 tw-px-4 ">
                                {loading ? (
                                    <Loading />
                                ) : (
                                    <>
                                        {trackingNumber === "" || trackingNumber.length < 17 ? null : (
                                            data.length === 0 ? (
                                                <p className="tw-text-center tw-text-gray-500">ไม่พบข้อมูลการจัดส่ง</p>
                                            ) : (
                                                data.map((event, index) => (
                                                    <div key={index} className="tw-relative tw-border-l tw-border-gray-300 tw-pl-6">
                                                        <div className="tw-mb-8 tw-flex tw-items-start">
                                                            <div className="tw-absolute tw-left-[-1rem] tw-top-0">
                                                                <i className='fas fa-check-circle tw-text-green-500 fa-2x'></i>
                                                            </div>
                                                            <div>
                                                                <p className="tw-text-sm tw-text-gray-500">{generateDates(event.shipmentDate, 6, 5)}</p>
                                                                <p className="tw-text-xs tw-text-gray-500">Time : {generateRandomTime()}</p>
                                                                <p className="tw-text-green-500 tw-font-bold">ปลายทางได้รับเรียบร้อยแล้ว</p>
                                                                <p className="tw-text-sm tw-text-gray-700">ผู้รับสินค้า: {event.name} {event.lastName}</p>
                                                            </div>
                                                        </div>

                                                        <div className="tw-mb-8 tw-flex tw-items-start">
                                                            <div className="tw-absolute tw-left-[-1rem] ">
                                                                <i className="fas fa-solid fa-clock tw-text-gray-500 fa-2x"></i>
                                                            </div>
                                                            <div>
                                                                <p className="tw-text-sm tw-text-gray-500">{generateDates(event.shipmentDate, 5, 4)}</p>
                                                                <p className="tw-text-xs tw-text-gray-500">Time : {generateRandomTime()}</p>
                                                                <p className="tw-text-gray-700">พัสดุรอนำส่ง</p>
                                                            </div>
                                                        </div>

                                                        <div className="tw-mb-8 tw-flex tw-items-start">
                                                            <div className="tw-absolute tw-left-[-1rem] ">
                                                                <i className="fas fa-solid fa-clock tw-text-gray-500 fa-2x"></i>
                                                            </div>
                                                            <div>
                                                                <p className="tw-text-sm tw-text-gray-500">{generateDates(event.shipmentDate, 4, 3)}</p>
                                                                <p className="tw-text-xs tw-text-gray-500">Time : {generateRandomTime()}</p>
                                                                <p className="tw-text-gray-700">พัสดุถึงสาขาปลายทาง</p>
                                                                <p className="tw-text-sm tw-text-gray-700">สมุทรปราการ - สมุทรปราการ</p>
                                                            </div>
                                                        </div>

                                                        <div className="tw-mb-8 tw-flex tw-items-start">
                                                            <div className="tw-absolute tw-left-[-1rem] ">
                                                                <i className="fas fa-solid fa-clock tw-text-gray-500 fa-2x"></i>
                                                            </div>
                                                            <div>
                                                                <p className="tw-text-sm tw-text-gray-500">{generateDates(event.shipmentDate, 3, 2)}</p>
                                                                <p className="tw-text-xs tw-text-gray-500">Time : {generateRandomTime()}</p>
                                                                <p className="tw-text-gray-700">รับเข้าคลังสินค้า</p>
                                                            </div>
                                                        </div>

                                                        <div className="tw-mb-8 tw-flex tw-items-start">
                                                            <div className="tw-absolute tw-left-[-1rem] ">
                                                                <i className="fas fa-solid fa-clock tw-text-gray-500 fa-2x"></i>
                                                            </div>
                                                            <div>
                                                                <p className="tw-text-sm tw-text-gray-500">{generateDates(event.shipmentDate, 2, 1)}</p>
                                                                <p className="tw-text-xs tw-text-gray-500">Time : {generateRandomTime()}</p>
                                                                <p className="tw-text-gray-700">พัสดุเข้าสู่ศูนย์คัดแยก</p>
                                                                <p className="tw-text-sm tw-text-gray-700">บางนา - กรุงเทพมหานคร</p>
                                                            </div>
                                                        </div>

                                                        <div className="tw-mb-8 tw-flex tw-items-start">
                                                            <div className="tw-absolute tw-left-[-1rem] ">
                                                                <i className="fas fa-solid fa-clock tw-text-gray-500 fa-2x"></i>
                                                            </div>
                                                            <div>
                                                                <p className="tw-text-sm tw-text-gray-500">{generateDates(event.shipmentDate, 1, 0)}</p>
                                                                <p className="tw-text-xs tw-text-gray-500">Time : {extractTime(event.shipmentDate)}</p>
                                                                <p className="tw-text-gray-700">ผู้ส่งมอบพัสดุที่จุดส่ง</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {alertMessage && alertType && (
                <Alert type={alertType} message={alertMessage} />
            )}
        </>
    );
};

export default DeliveriesPage;
