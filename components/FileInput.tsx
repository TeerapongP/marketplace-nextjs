import React, { ChangeEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import FileInputProps from './interface/FileInputProps';
import TextInput from '@/components/Input';
import IconsShop from '../public/iconsImage.svg';

const FileInput: React.FC<FileInputProps> = ({ onFileChange, value = [], className }) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [filesObject, setFilesObject] = useState<{ [key: string]: File }>({});

  useEffect(() => {
    const newFilesObject: { [key: string]: File } = {};
    const newImagePreviews: string[] = [];

    // Check if value is a string URL or an array of files
    if (typeof value === 'string') {
      newImagePreviews.push(value); // Push the URL directly if it's a string
    } else if (Array.isArray(value)) {
      value.forEach((file, index) => {
        newFilesObject[index] = file;
        newImagePreviews.push(URL.createObjectURL(file));
      });
    }

    setFilesObject(newFilesObject);
    setPreviewImages(newImagePreviews);
  }, [value]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFilesObject: { [key: string]: File } = {};
      const newImagePreviews: string[] = [];

      Array.from(event.target.files).forEach((file) => {
        const newKey = `${Object.keys(newFilesObject).length}`;
        newFilesObject[newKey] = file;
        newImagePreviews.push(URL.createObjectURL(file));
      });

      // Convert filesObject to an array and pass it to onFileChange
      onFileChange(Object.values(newFilesObject));  // Ensure it's an array
      setFilesObject(newFilesObject);
      setPreviewImages(newImagePreviews);

      // Clear the file input value
      event.target.value = '';
    }
  };

  // Cleanup URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      previewImages.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [previewImages]);

  return (
    <>
      <div className='tw-grid tw-grid-cols tw-justify-center tw-gap-4'>
        {previewImages.length > 0 && (
          <div className="tw-flex-wrap tw-justify-center">
            {previewImages.map((src, index) => (
              <div key={index} className="tw-relative lg:tw-w-96	lg:tw-h-96 tw-bg-red-600 md:tw-w-24 md:tw-h-24 sm:tw-w-20 sm:tw-h-20 sm:tw-mt-5">
                <Image
                  src={src}
                  alt={`Uploaded ${index}`}
                  layout="fill"
                  objectFit="cover"
                  className="tw-w-fit tw-h-full"
                />
              </div>
            ))}
          </div>
        )}
        <div className={`tw-text-white  tw-px-4 tw-rounded-lg tw-border-none ${className}`}>
          {previewImages.length === 0 && ( // Use strict equality check
            <IconsShop className="tw-rounded-full tw-flex tw-justify-center tw-items-center" />
          )}
        </div>
        <div>
          <TextInput
            type="file"
            id="file-input"
            name='file-input'
            onChange={handleFileChange}
            className="custom-sm:tw-mt-5 tw-flex tw-justify-center tw-items-center tw-border-2 tw-cursor-pointer tw-w-full"
          />
        </div>
      </div>
    </>
  );
};

export default FileInput;
