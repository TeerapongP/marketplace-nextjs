'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Alert from '../../components/Alert';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import SignupIcon from '../../public/iconsSignUp.svg';
import TextInput from '@/components/Input';


const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName] = useState('');
  const [lastName] = useState('');
  const [email] = useState('');
  const [phoneNumber] = useState('');
  const [address] = useState('');
  const [userImage] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, roleId,firstName,lastName,email,phoneNumber,address,userImage }),

      });
      if (res.ok) {
        setUsername(''); // Clear username
        setPassword(''); // Clear password
        setRoleId(0)
        router.push('/login'); // Redirect to a protected route
        setAlertMessage('Register successful');
        setAlertType('success');
      } else {
        const errorMessage = 'Something went wrong. Please try again.';
        setAlertMessage(errorMessage);
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('An unexpected error occurred. Please try again later.');
      setAlertType('error');
    }
  };
  const handleSelect = (roleId: number) => {
    setRoleId(roleId)
  };

  return (
    <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center tw-h-screen tw-bg-custom-green tw-p-4 tw-gap-4">
      <div className="tw-relative tw-w-full tw-max-w-[60vw] tw-h-64 sm:tw-h-80 md:tw-h-96 lg:tw-h-[500px] tw-flex tw-items-center tw-justify-center">
        <div className="tw-flex-1 tw-bg-custom-yellow tw-shadow-lg tw-rounded-lg tw-p-4 sm:tw-p-6 md:tw-p-8 lg:tw-p-8 tw-text-center tw-z-10">
          <div className='tw-w-full'>
            <h1 className="tw-text-lg sm:tw-text-2xl md:tw-text-3xl tw-font-bold tw-mb-4 sm:tw-mb-5 lg:tw-mb-3">Register</h1>
          </div>
          <div className="tw-max-w-full tw-w-full">
            <form onSubmit={handleSubmit} className="tw-space-y-4">
              <div className="tw-w-full tw-text-start">
                <label className="tw-block tw-font-medium">User type</label>
                <Dropdown
                  url="/api/role" // Your API endpoint to fetch roles
                  onSelect={handleSelect}
                  placeholder="Select a role"
                />
              </div>
              <div className="tw-w-full tw-text-start">
                <label className="tw-block tw-font-medium">Username</label>
                <TextInput
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="tw-w-full"
                />
              </div>
              <div className="tw-w-full tw-text-start">
                <label className="tw-block tw-font-medium">Password</label>
                <TextInput
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="tw-w-full"
                />
                  <div className='tw-text-center tw-mt-2'>
                  <Link href="/login">
                      Already a member / Login
                  </Link>
                  </div>
              </div>
           
              <Button type="submit" text="Register" width="tw-w-80" textColor='tw-text-black' color="tw-bg-white" />
              
            </form>
          </div>

        </div>
        <div className="tw-flex-1 tw-bg-custom-gray tw-shadow-lg tw-rounded-lg tw-p-4 sm:tw-p-6 md:tw-p-8 lg:tw-p-7 tw-text-center tw-z-0 tw-m-h-[100vh]">
          <div className='tw-flex tw-justify-center tw-items-center'>
            <SignupIcon />
          </div>
        </div>
      </div>
      {alertMessage && alertType && (
        <Alert type={alertType} message={alertMessage} />
      )}
    </div >
  );
};

export default RegisterPage;
