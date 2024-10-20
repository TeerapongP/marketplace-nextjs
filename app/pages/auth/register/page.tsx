'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Alert from '../../../../components/Alert';
import Dropdown from '../../../../components/Dropdown';
import Button from '../../../../components/Button';
import SignupIcon from '../../../../public/iconsSignUp.svg';
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
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000); // Hide alert after 3 seconds

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [alertMessage]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, roleId, firstName, lastName, email, phoneNumber, address, userImage }),

      });
      if (res.ok) {
        setUsername('');
        setPassword('');
        setRoleId(0)
        router.push('/pages/auth/login'); // Redirect to a protected route
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
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-r tw-from-blue-600 tw-to-purple-500">
      <div className="tw-w-full tw-max-w-lg tw-bg-white tw-p-10 tw-rounded-3xl tw-shadow-2xl tw-relative tw-overflow-hidden">
        <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-br  tw-bg-blue-500 tw-opacity-10 tw-pointer-events-none"></div>
        <h2 className="tw-text-3xl tw-font-bold tw-text-center tw-text-gray-800 tw-mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="tw-mt-8">
          <div className="tw-mb-6">
            <label htmlFor="role" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 ">
              Role
            </label>
            <Dropdown
              url="/api/role"
              onSelect={handleSelect}
              valueString="roleId,roleName"
              keyString="roleId,roleName"
              placeholder="Select a role"
              className="tw-w-full tw-mt-2 tw-px-8 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm tw-focus:outline-none tw-focus:ring tw-text-start"
            />
          </div>
          <div className="tw-mb-6">
            <label htmlFor="username" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              Username
            </label>
            <TextInput
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              className="tw-w-full tw-mt-2 tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm tw-focus:outline-none tw-focus:ring tw-focus:ring-purple-400"
            />
          </div>

          <div className="tw-mb-6">
            <label htmlFor="password" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              Password
            </label>
            <TextInput
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="tw-w-full tw-mt-2 tw-px-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm tw-focus:outline-none tw-focus:ring "
            />
          </div>

          <Button
            type="submit"
            text="Register"
            className='tw-w-full tw-py-3 tw-bg-gradient-to-r tw-from-purple-500 tw-to-blue-600 tw-text-white tw-rounded-lg tw-shadow-lg tw-transform tw-hover:scale-105 tw-transition-all tw-duration-300'
          />
        </form>
        <div className="tw-mt-6 tw-flex tw-items-center tw-justify-between">
          <Link href="/pages/auth/forgotpassword" className="tw-text-sm tw-text-purple-600 hover:tw-underline">
            Forgot your password?
          </Link>
          <Link href="/pages/auth/login" className='tw-text-sm tw-text-purple-600 hover:tw-underline'>
            Login
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

export default RegisterPage;
