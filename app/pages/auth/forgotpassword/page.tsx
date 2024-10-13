'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '../../../../components/Alert';
import Button from '../../../../components/Button';
import TextInput from '@/components/Input';
import bcrypt from 'bcryptjs';
import Link from 'next/link';


const ForgotPasswordPage = () => {
  const [userName, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const router = useRouter();


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
      const res = await fetch('/api/auth/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, newPassword: hashedPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsername('');
        setNewPassword('');
        router.push('/pages/auth/login');
        setAlertMessage('Change password successful');
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

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);
  return (
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-r tw-from-blue-600 tw-to-purple-500">
      <div className="tw-w-full tw-max-w-lg tw-bg-white tw-p-10 tw-rounded-3xl tw-shadow-2xl tw-relative tw-overflow-hidden">
        <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-br  tw-bg-blue-500 tw-opacity-10 tw-pointer-events-none"></div>
        <h2 className="tw-text-3xl tw-font-bold tw-text-center tw-text-gray-800 tw-mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="tw-mt-8">
          <div className="tw-mb-6">
            <label htmlFor="username" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              Username
            </label>
            <TextInput
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="tw-w-full"
            />
          </div>

          <div className="tw-mb-6">
            <label htmlFor="password" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              Password
            </label>
            <TextInput
              type="password"
              id="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="tw-w-full"
            />
          </div>
          <Button
            type="submit"
            text="Forgot Password"
            className='tw-w-full tw-py-3 tw-bg-gradient-to-r tw-from-purple-500 tw-to-blue-600 tw-text-white tw-rounded-lg tw-shadow-lg tw-transform tw-hover:scale-105 tw-transition-all tw-duration-300'
          />
        </form>
        <div className="tw-mt-6 tw-flex tw-items-center tw-justify-between">
          <Link href="/pages/auth/login" className="tw-text-sm tw-text-purple-600 hover:tw-underline">
            Login
          </Link>
          <Link href="/pages/auth/register" className='tw-text-sm tw-text-purple-600 hover:tw-underline'>
            Register
          </Link>
        </div>
      </div>

      {
        alertMessage && alertType && (
          <Alert type={alertType} message={alertMessage} />
        )
      }
    </div >
  );
};

export default ForgotPasswordPage;
