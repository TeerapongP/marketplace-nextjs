// components/FileInput.tsx
import React from 'react';
import FileInputProps from './interface/FileInputProps';



const FileInput: React.FC<FileInputProps> = ({ onChange, label }) => {
  return (
    <div className="tw-relative tw-flex tw-items-center tw-justify-center">
      <input
        type="file"
        onChange={onChange}
        className="tw-absolute tw-invisible tw-h-full tw-w-full tw-opacity-0 tw-cursor-pointer"
      />
      <label className="tw-p-2 tw-bg-blue-500 tw-text-white tw-rounded tw-cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default FileInput;
