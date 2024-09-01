import React from 'react';
import CardProps from './interface/CardProps';
import Image from 'next/image';
import ToggleSwitch from './Toggle';
import Button from './Button';

const Card: React.FC<CardProps> = ({ title, content, imageUrl, status }) => {
  return (
    <div className="tw-bg-gray-100 tw-shadow-md tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 tw-max-w-sm">
      {imageUrl && (
        <div className="tw-relative tw-w-full tw-h-48">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="tw-object-cover"
          />
        </div>
      )}
      <div className="tw-p-4">
        <h2 className="tw-text-xl tw-font-bold tw-text-gray-900">{title}</h2>
        <p className="tw-text-gray-600 tw-mt-2">{content}</p>
      </div>
      <div className="tw-p-4 tw-flex tw-items-center">

        <Button
          type="submit"
          text="View"
          width="tw-w-48 custom-sm:tw-w-16"
          height="tw-h-10"
          textColor="tw-text-black"
          color="tw-bg-white"
          disabled={false === status ? true : false}
        />
        <div className="tw-mx-4"> {/* Adjust spacing between elements */}
          <ToggleSwitch
            label="Open"
            checked={status}
          />
        </div>
      </div>

    </div>
  );
};

export default Card;
