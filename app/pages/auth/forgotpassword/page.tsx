'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '../../../../components/Alert';
import Button from '../../../../components/Button';
import ForgotPassword from '../../../../public/iconsLock.svg';
import TextInput from '@/components/Input';
import bcrypt from 'bcryptjs';


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
    <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center tw-h-screen tw-bg-custom-yellow tw-p-4 tw-gap-4">
      <div className="tw-flex tw-w-full tw-max-w-[60vw] tw-h-64 sm:tw-h-80 md:tw-h-96 lg:tw-h-[500px]">
        <div className="tw-flex-1 tw-bg-custom-green tw-shadow-lg tw-rounded-lg tw-p-4 sm:tw-p-6 md:tw-p-8 lg:tw-p-6 tw-text-center tw-flex tw-flex-col tw-justify-center tw-items-center">
          <h1 className="tw-text-lg sm:tw-text-2xl md:tw-text-3xl tw-font-bold tw-mb-4 sm:tw-mb-6 lg:tw-mb-8">Forgot your password?</h1>
          <form onSubmit={handleSubmit} className="tw-w-full tw-space-y-4">
            <div className="tw-w-full tw-text-start">
              <label className="tw-block tw-font-medium">Username</label>
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
            <div className="tw-w-full tw-text-start">
              <label className="tw-block tw-font-medium">Password</label>
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
            <Button type="submit" text="Confirm" width="tw-w-80" textColor="tw-text-white" color="tw-bg-black" />
          </form>
        </div>
        <div className="tw-flex-1 tw-bg-custom-gray tw-shadow-lg tw-rounded-lg tw-p-4 sm:tw-p-6 md:tw-p-8 lg:tw-p-10 tw-flex tw-justify-center tw-items-center">
          <ForgotPassword />
        </div>
      </div>
      {alertMessage && alertType && (
        <Alert type={alertType} message={alertMessage} />
      )}
    </div>
  );
};

export default ForgotPasswordPage;
