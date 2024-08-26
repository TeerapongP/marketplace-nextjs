'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '../../components/Alert';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import LoginIcon from '../../public/iconsLoginPage.svg';
import TextInput from '@/components/Input';
import Link from 'next/link';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password,roleId }),
        
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setUsername(''); // Clear username
        setPassword(''); // Clear password
        setRoleId(0)
      
        router.push('/'); // Redirect to a protected route
        setAlertMessage('Login successful');
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
<div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-center tw-h-screen tw-bg-custom-yellow tw-p-4 tw-gap-4">
  <div className="tw-relative tw-w-full tw-max-w-[60vw] tw-h-64 sm:tw-h-80 md:tw-h-96 lg:tw-h-[500px] tw-flex tw-items-center tw-justify-center">
        <div className="tw-flex-1 tw-bg-custom-green tw-shadow-lg tw-rounded-lg tw-p-4 sm:tw-p-6 md:tw-p-8 lg:tw-p-6 tw-text-center tw-z-10 tw-grid tw-grid-rows-auto tw-gap-4">
          <div className='tw-w-full'>
            <h1 className="tw-text-lg sm:tw-text-2xl md:tw-text-3xl tw-font-bold tw-mb-4 sm:tw-mb-6 lg:tw-mb-8">Login</h1>
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
                  <Link href="/">
                    Forgot your password? 
                  </Link>
                  <Link href="/register">
                       / Register
                  </Link>
                  </div>
              </div>
              <Button type="submit" text="Login" width="tw-w-80" textColor='tw-text-black' color="tw-bg-white" />
            </form>
          </div>

        </div>
        <div className="tw-flex-1 tw-bg-custom-gray tw-shadow-lg tw-rounded-lg tw-p-4 sm:tw-p-6 md:tw-p-8 lg:tw-p-10 tw-text-center tw-z-0">
          <div className='tw-flex tw-justify-center tw-items-center'>
            <LoginIcon />
          </div>
        </div>
      </div>
      {alertMessage && alertType && (
        <Alert type={alertType} message={alertMessage} />
      )}
    </div >
  );
};

export default LoginPage;
