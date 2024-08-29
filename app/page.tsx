'use client'
import SearchInput from '../components/SearchInput';
export default function Home() {

  const handleSearch = (value: string) => {
    console.log("value : ", value)
  };

  return (
    <div className='tw-w-full'>
      <div className='tw-grid sm:tw-mt-24 md:tw-mt-24 lg:tw-mt-24 custom-sm:tw-mt-24 custom-sm:tw-justify-items-center tw-justify-items-end tw-mr-20 custom-sm:tw-mr-0'>
        <SearchInput onSearch={handleSearch} />
      </div>
      
    </div>

  );
}
