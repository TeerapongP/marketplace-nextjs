'use client';

import { useState } from 'react';
import FileInputCircle from "@/components/FileInputCircle";

const Profile = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (files: { [key: string]: File }) => {
    console.log(files[0])
    setFile(files[0]);  // Update state with the selected file
  };

  return (
    <div className="tw-flex tw-justify-center tw-mt-20">
      <p>{file ? `File details: ${JSON.stringify(file)}` : 'No file selected'}</p>
      <FileInputCircle onFileChange={handleFileUpload} />
    </div>
  );
};

export default Profile;
