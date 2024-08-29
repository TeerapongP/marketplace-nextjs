// pages/404.tsx
import { NextPage } from 'next';
import Link from 'next/link';

const Custom404: NextPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">
                <a>Go back home</a>
            </Link>
        </div>
    );
};

export default Custom404;
