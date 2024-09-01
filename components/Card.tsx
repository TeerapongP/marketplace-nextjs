import React from 'react';
import CardProps from './interface/CardProps';
import Image from 'next/image';
import ToggleSwitch from './Toggle';
import Button from './Button';

const Card: React.FC<CardProps> = ({ title, content, imageUrl, status }) => {
  return (
    <div className="tw-bg-gray-100 tw-shadow-md tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 tw-max-w-sm">
      <div className="tw-grid tw-grid-rows-[auto_1fr_auto] tw-gap-4 tw-h-full">
        {/* Image Section */}
        {imageUrl && (
          <div className="tw-relative tw-w-full tw-h-48 tw-row-span-1">
            <Image
              src={imageUrl}
              alt={title}
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
          <Button
            type="submit"
            text="View"
            width="tw-w-48 custom-sm:tw-w-16"
            height="tw-h-10"
            textColor="tw-text-black"
            color="tw-bg-white"
            disabled={false === status}
            className="tw-mr-4" // Added margin-right
          />
          <div className="tw-flex tw-items-center tw-ml-4 tw-mt-4">
            <ToggleSwitch
              label={true === status ? 'open' : 'close'}
              checked={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
