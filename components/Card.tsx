import React, { useState, useEffect } from 'react';
import CardProps from './interface/CardProps';
import Image from 'next/image';
import ToggleSwitch from './Toggle';
import Button from './Button';
import IconsCart from '../public/iconsCart.svg'
const Card: React.FC<CardProps> = ({
  title,
  content,
  imageUrl,
  status = false,
  shopId,
  disabled,
  bgColor,
  price,
  bgButtonColor,
  onToggleChange,
  onButtonClick
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(status);
  const [token, setToken] = useState<string | null>(null);
  // Sync the toggle state with the initial status prop
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken)
    setIsToggled(status);
  }, [status]);

  const handleToggleChange = (checked: boolean) => {
    setIsToggled(checked);
    if (onToggleChange && shopId !== undefined) {
      onToggleChange(shopId, checked); // Pass shopId and checked value
    }
  };

  const handleButtonClick = () => {
    if (onButtonClick && shopId !== undefined) {
      onButtonClick(shopId); // Pass shopId when button is clicked
    }
  };

  return (
    <div className={`${bgColor ? bgColor : 'tw-bg-gray-100'} tw-shadow-md tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 tw-max-w-sm`}>
      <div className="tw-grid tw-grid-rows-[auto_1fr_auto] tw-gap-4 tw-h-full">
        {/* Image Section */}
        {imageUrl && (
          <div className="tw-relative tw-w-full tw-h-48 tw-row-span-1">
            <Image
              src={imageUrl}
              alt={title || ""}
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

        {/* Footer Section */}
        <div className="tw-p-4 tw-flex tw-items-center tw-justify-between tw-row-span-1">
          {status ? (
            <>
              <div className="tw-flex tw-items-center tw-ml-4 tw-mt-4">
                <Button
                  type="submit"
                  text="View"
                  width="tw-w-48 custom-sm:tw-w-16"
                  height="tw-h-10"
                  textColor="tw-text-black"
                  color="tw-bg-white"
                  disabled={false}
                  className="tw-mr-4"
                  onClick={handleButtonClick}
                />
              </div>
              <div className="tw-flex tw-items-center tw-ml-4 tw-mt-4">
                <ToggleSwitch
                  label={isToggled ? 'open' : 'close'}
                  checked={isToggled}
                  onChange={handleToggleChange}
                  disabled={disabled}
                />
              </div>
            </>
          ) : <div className="tw-flex tw-items-center tw-ml-4 tw-mt-4 tw-justify-between tw-w-full">
            <Button
              type="submit"
              text={price ? `฿${price.toString()}` : ""}
              width="tw-w-24 custom-sm:tw-w-16"
              height="tw-h-10"
              textColor="tw-text-white"
              color={disabled ? bgButtonColor : 'tw-bg-green-600'}
              disabled={null === token}
              className="tw-mr-4"
              onClick={handleButtonClick}
            />
            <Button
              type="submit"
              textColor="tw-text-white"
              color={disabled ? bgButtonColor : 'tw-bg-blue-500'}
              className=" tw-text-white tw-font-bold tw-px-4 tw-py-2 tw-rounded tw-shadow-lg hover:tw-bg-blue-600 focus:tw-outline-none focus:tw-ring-2 
            focus:tw-ring-blue-300 tw-flex tw-items-center tw-space-x-2"
            >
              <i className="fas fa-shopping-cart tw-w-5 tw-h-5"></i>
              <span>Cart</span>
            </Button>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Card;
