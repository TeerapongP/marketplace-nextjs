import React, { ChangeEvent, useState, useRef } from 'react';
import Image from 'next/image';
import IconsUser from '../public/iconsUser.svg';
import FileInputCircleProps from './interface/FileInputCircleProps';

const FileInputCircle: React.FC<FileInputCircleProps> = ({ onFileChange }) => {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [filesObject, setFilesObject] = useState<{ [key: string]: File }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFilesObject: { [key: string]: File } = { ...filesObject };
            const newImagePreviews: string[] = [...previewImages];

            Array.from(event.target.files).forEach((file) => {
                const newKey = `${Object.keys(newFilesObject).length}`;
                newFilesObject[newKey] = file;
                newImagePreviews.push(URL.createObjectURL(file));
            });

            onFileChange(newFilesObject);
            setFilesObject(newFilesObject);
            setPreviewImages(newImagePreviews);
        }
    };

    return (
        <>
            {!previewImages.length ? (
                <label
                    htmlFor="file-input"
                    className="tw-cursor-pointer"
                >
                    <input
                        type="file"
                        id="file-input"
                        ref={fileInputRef}
                        className="tw-hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <IconsUser className="tw-cursor-pointer tw-rounded-full tw-bg-gray-200 custom-sm:tw-mt-5 tw-flex tw-justify-center tw-items-center tw-border-2 tw-border-green-500" />
                </label>
            ) : (
                <div className="tw-flex tw-gap-2 tw-flex-wrap tw-justify-center" >
                    {previewImages.map((src, index) => (
                        <div key={index} className="tw-relative lg:tw-w-40 lg:tw-h-40 md:tw-w-24 md:tw-h-24 sm:tw-w-20 sm:tw-h-20 sm:tw-mt-5 custom-sm:tw-w-20 custom-sm:tw-h-20 custom-sm:tw-mt-5 tw-rounded-full">
                            <Image
                                src={src}
                                alt={`Uploaded ${index}`}
                                layout="fill"
                                objectFit="cover"
                                className="tw-rounded-full"

                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default FileInputCircle;
