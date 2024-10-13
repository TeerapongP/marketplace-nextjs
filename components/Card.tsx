import React, { useState, useEffect } from 'react';
import CardProps from './interface/CardProps';
import Image from 'next/image';
import ToggleSwitch from './Toggle';
import Button from './Button';

import Product from '../app/interface/products';

const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  status = false,
  shopId,
  disabled,
  bgColor,
  price,
  roleId,
  bgButtonColor,
  hideButton = false,
  reserveStall = false,
  onToggleChange,
  onButtonClick,
  onButtonViewClick,
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(status);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setIsToggled(status);
  }, [status]);

  const handleToggleChange = (checked: boolean) => {
    setIsToggled(checked);
    if (onToggleChange && shopId !== undefined) {
      onToggleChange(shopId, checked);
    }
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      const product: Product = {
        productId: shopId ?? 0,
        productName: title ?? '',
        description: content ?? '',
        price: price ?? 0,
        stock: 0,
        images: imageUrl ?? '',
        quantity: 0,
      };
      onButtonClick(product);
    }
  };

  const handleButtonViewClick = () => {
    if (onButtonViewClick && shopId !== undefined) {
      onButtonViewClick(shopId); // Pass shopId when button is clicked
    }
  };


  return (
    <div className={`${bgColor ?? 'tw-bg-gray-100'} tw-shadow-md tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 tw-max-w-sm tw-relative`}>


      <div className="tw-grid tw-grid-rows-[auto_1fr_auto] tw-gap-4 tw-h-full">

        {imageUrl && (
          <div className="tw-relative tw-w-96 tw-h-56 tw-row-span-1">
            <Image
              src={imageUrl}
              alt={title ?? ''}
              layout="fill"
              objectFit="cover"
              className="tw-object-cover"
            />
          </div>
        )}

        {/* Content Section */}
        <div className="tw-p-4 tw-row-span-1 tw-overflow-auto">
          <h2 className="tw-text-xl tw-font-bold tw-text-gray-900">{title}</h2>
          <p className="tw-text-gray-600 tw-mt-2">{content}</p>
        </div>

        {price !== undefined ? (
          <div className="tw-flex tw-items-center tw-ml-4 tw-my-4 tw-justify-between tw-w-full" >
            {!hideButton && !reserveStall ? (
              <div className="tw-flex tw-items-center tw-ml-4 tw-my-4 tw-justify-between tw-w-full">
                <Button
                  type="submit"
                  text={price ? `฿${price.toFixed(2)}` : ''} // Format price to 2 decimal places
                  width="tw-w-24 custom-sm:tw-w-16"
                  height="tw-h-10"
                  textColor="tw-text-white"
                  color={disabled ? bgButtonColor : 'tw-bg-green-600'}
                  disabled={null === token}
                  className="tw-mr-4"
                />
                <Button
                  type="submit"
                  textColor="tw-text-white"
                  color={disabled ? bgButtonColor : 'tw-bg-blue-500'}
                  className="tw-text-white tw-font-bold tw-mr-8 tw-px-4 tw-py-2 tw-rounded tw-shadow-lg hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-300 tw-flex tw-items-center tw-space-x-2"
                  onClick={handleButtonClick}
                >
                  <i className="fas fa-shopping-cart tw-w-5 tw-h-5"></i>
                  <span>Cart</span>
                </Button>
              </div>
            ) :
              <div className="tw-flex tw-items-center tw-justify-center ">
                <Button
                  type="submit"
                  text="Reserve Stall"
                  width="tw-w-80 custom-sm:tw-w-16"
                  height="tw-h-10"
                  textColor="tw-text-black"
                  color="tw-bg-white"
                  disabled={false}
                  onClick={handleButtonClick}
                  className='tw-mx-4'
                />
              </div>
            }
          </div>
        ) : (
          <div className="tw-p-4 tw-flex tw-items-center tw-justify-between tw-row-span-1">
            {!hideButton ? (
              <>
                <Button
                  type="submit"
                  text="View"
                  width="tw-w-full"
                  height="tw-h-10"
                  textColor="tw-text-black"
                  color="tw-bg-white"
                  disabled={false}
                  onClick={handleButtonViewClick}
                  className='tw-mx-4 tw-mr-10'
                />

                <div className="tw-flex tw-items-center tw-ml-4 tw-mt-4">
                  <ToggleSwitch
                    label={isToggled ? 'open' : 'close'}
                    checked={isToggled}
                    onChange={handleToggleChange}
                    disabled={Number(roleId) === 2 || disabled}
                  />
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;