'use client';
import { useEffect, useState } from 'react';
import SearchInput from '../components/SearchInput';
import Card from '../components/Card';
import Loading from '../components/Loading';
import Shop from './interface/shop';

export default function Home() {
  const [data, setData] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all shops
  const fetchShopAll = async () => {
    try {
      const res = await fetch('/api/shop/shop-list');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Shop[] = await res.json();
      setData(data);
    } catch (error) {
      setError('Error fetching shop list');
      console.error('Error fetching shop list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchShopAll();
  }, []); // Empty dependency array means this will run once after the initial render

  // Handle search
  const handleSearch = async (value: string) => {
    setData([]);
    setLoading(true);
    console.log("Search value:", value);

    try {
      if (value.trim() === '') {
        // Fetch all shops if search value is empty
        await fetchShopAll();
      } else {
        const encodedValue = encodeURIComponent(value);
        const res = await fetch(`/api/shop/shop-find-by-name?shopName=${encodedValue}`);

        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }

        const data: Shop[] = await res.json();
        setData(data);
      }
    } catch (error) {
      setError(`Error fetching search results`);
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };



  // Handle click
  const handleClick = (value: string) => {
    if (value.trim() === '') {
      fetchShopAll(); // Fetch all shops if search value is empty
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className='tw-w-full'>
      <div className='tw-grid sm:tw-mt-24 md:tw-mt-24 lg:tw-mt-24 custom-sm:tw-mt-24 custom-sm:tw-justify-items-center tw-justify-items-end tw-mr-20 custom-sm:tw-mr-0'>
        <SearchInput onSearch={handleSearch} onClick={handleClick} />
      </div>
      <div className='tw-grid tw-gap-4 tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-pl-4 custom-sm:tw-pr-4 tw-mt-5'>
        {data.length > 0 && data.map((item) => (
          <Card
            key={item.shopName} // Ensure this is unique for each Card
            title={item.shopName}
            content={item.shopDescription}
            imageUrl={item.shopImages}
            status={item.status}
          />
        ))}
      </div>

    </div>
  );
}
