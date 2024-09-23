'use client';

import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Shipment from '../../interface/shipment';
import Image from 'next/image';
import Loading from '@/components/Loading'; // Adjust path as necessary

const DeliveriesPage: NextPage = () => {
    const [deliveries, setDeliveries] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchDeliveries = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/deliveries', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch deliveries');
                }

                const data = await response.json();
                setDeliveries(data);
            } catch (error) {
                setAlertMessage(`ERROR: ${error}`);
                setAlertType('error');
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    return (
        <></>
        // <div className="tw-container tw-mx-auto tw-p-6">
        //     {loading && <Loading />}
        //     {alertMessage && (
        //         <div className={`tw-p-4 tw-mb-4 tw-rounded-lg tw-text-white ${alertType === 'error' ? 'tw-bg-red-500' : 'tw-bg-green-500'}`}>
        //             {alertMessage}
        //         </div>
        //     )}
        //     <h1 className="tw-text-3xl tw-font-bold tw-text-center tw-mb-6">Deliveries</h1>
        //     <div className="tw-grid tw-grid-cols-1 tw-gap-6 sm:tw-grid-cols-2 lg:tw-grid-cols-3">
        //         {deliveries.map((shipment) => (
        //             <div key={shipment.shipmentId} className="tw-bg-white tw-shadow-xl tw-rounded-lg tw-p-4 tw-flex tw-flex-col sm:tw-flex-row tw-w-full transition-transform transform hover:scale-105">
        //                 <div className="tw-relative tw-h-32 tw-w-32 tw-mr-4">
        //                     <Image
        //                         src={shipment.order.orderItems[0]?.product.images || ''} // ใช้ภาพแรกจากรายการสั่งซื้อ
        //                         alt={shipment.order.orderItems[0]?.product.productName || ''}
        //                         layout="fill"
        //                         objectFit="cover"
        //                         className="tw-object-cover tw-rounded-lg"
        //                     />
        //                 </div>
        //                 <div className="tw-flex-1">
        //                     <h2 className="tw-font-bold tw-text-xl">{shipment.name} {shipment.lastName}</h2>
        //                     <p className="tw-text-gray-700">{shipment.address}, {shipment.city}, {shipment.state}, {shipment.country}, {shipment.zipCode}</p>
        //                     <p className="tw-text-sm tw-text-gray-500">Shipment Date: {new Date(shipment.shipmentDate).toLocaleDateString()}</p>
        //                     <h3 className="tw-font-semibold tw-mt-4">Order Items:</h3>
        //                     <ul className="tw-list-disc tw-pl-5">
        //                         {shipment.order.orderItems.map((item: any) => (
        //                             <li key={item.orderItemId} className="tw-mb-2">
        //                                 <div className="tw-flex tw-items-center tw-justify-between">
        //                                     <span className="tw-font-medium">{item.product.productName} (x{item.quantity})</span>
        //                                     <span className="tw-font-semibold">฿{item.product.price.toFixed(2)}</span>
        //                                 </div>
        //                                 <p className="tw-text-sm tw-text-gray-600">{item.product.description}</p>
        //                             </li>
        //                         ))}
        //                     </ul>
        //                     <p className="tw-font-bold tw-mt-4">Total Price: ฿{shipment.order.totalPrice.toFixed(2)}</p>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
};

export default DeliveriesPage;
