'use client'; // Add this directive to mark this file as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Client Components
import Alert from '../../components/Alert';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | null>(null);
  const router = useRouter(); // Using useRouter from next/navigation

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem('token', data.token);
      router.push('/'); // Redirect to a protected route
    } else {
      const errorMessage = 'Something went wrong. Please try again.';
      setAlertMessage(errorMessage);
      setAlertType('error');
    }
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gray-100">
      <div className="tw-w-full tw-max-w-md tw-bg-white tw-shadow-lg tw-rounded-lg tw-p-8">
        <h1 className="tw-text-2xl tw-font-bold tw-mb-6">Login</h1>
        {alertMessage && alertType && (
          <Alert type={alertType} message={alertMessage} />
        )}
        <form onSubmit={handleSubmit} className="tw-space-y-4">
          <div>
            <label htmlFor="username" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="tw-mt-1 tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-2 tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="tw-mt-1 tw-block tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:ring-2 tw-focus:ring-indigo-500 tw-focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="tw-w-full tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-font-bold tw-rounded-md tw-shadow-sm tw-hover:bg-indigo-700 tw-focus:ring-2 tw-focus:ring-offset-2 tw-focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
