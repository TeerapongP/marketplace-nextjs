'use client';

import { useState } from 'react';
import FileInputCircle from "@/components/FileInputCircle";
import TextInput from '@/components/Input';
import Button from '@/components/Button';

const Profile = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (files: { [key: string]: File }) => {
    (files[0])
    setFile(files[0]);  // Update state with the selected file
  };

  return (
    <div className='tw-mt-20 tw-mx-20'>
      <div className="tw-flex tw-justify-center tw-my-10">
        <FileInputCircle onFileChange={handleFileUpload} />
      </div>
      <div className="tw-flex tw-flex-col tw-justify-center tw-items-center">
        <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
          <div >
            <span>First name</span>
            <TextInput
              type="text"
              id="firstName"
              required

              className="tw-w-full"
            />
          </div>

          <div >
            <span>Last name</span>
            <TextInput
              type="text"
              id="lastName"
              required
              className="tw-w-full"
            />
          </div>
        </div>
        <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
          <div >
            <span>Email</span>
            <TextInput
              type="text"
              id="email"
              required
              className="tw-w-full"
            />
          </div>
          <div >
            <span>Phone</span>
            <TextInput
              type="number"
              id="phone"
              required
              className="tw-w-full"
            />
          </div>
        </div>
        <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
          <div >
            <span>Village</span>
            <TextInput
              type="text"
              id="village"
              required
              className="tw-w-full"
            />
          </div>
          <div >
            <span>Address</span>
            <TextInput
              type="text"
              id="address"
              required
              className="tw-w-full"
            />
          </div>

        </div>
        <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-1 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
          <div >
            <span>City</span>
            <TextInput
              type="text"
              id="city"
              required
              className="tw-w-full"
            />
          </div>
        </div>
        <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-3.5 tw-w-[50vw]">
          <div >
            <span>User Name</span>
            <TextInput
              type="text"
              id="userName"
              required
              className="tw-w-full"
            />
          </div>
          <div >
            <span>Password</span>
            <TextInput
              type="text"
              id="passowd"
              required
              className="tw-w-full"
            />
          </div>
        </div>
        <div className="tw-grid sm:tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-2 tw-mt-10 tw-w-1/2 ">
          <div>
            <Button
              type="button"
              text="Save"
              width="tw-w-full"
              textColor="tw-text-white"
              color="tw-bg-blue-700"
            />
          </div>
          <div>
            <Button
              type="button"
              text="Reset"
              width="tw-w-full"
              textColor="tw-text-white"
              color="tw-bg-red-700"
            />
          </div>
        </div>

      </div>


    </div>

  );
};

export default Profile;
