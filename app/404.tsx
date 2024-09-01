// pages/404.tsx
import { NextPage } from 'next';
import Link from 'next/link';

const Custom404: NextPage = () => {
    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen tw-bg-gray-100 tw-text-center tw-px-4">
            <h1 className="tw-text-4xl tw-font-bold tw-text-red-600">404 - Page Not Found</h1>
            <p className="tw-mt-4 tw-text-lg tw-text-gray-700">The page you are looking for does not exist.</p>
            <Link href="/" className="tw-mt-6 tw-inline-block tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-600">
                    Go back home
            </Link>
        </div>
    );
};

export default Custom404;
