'use client'
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [currentUserRoleId, setCurrentUserRoleId] = useState<number | string>(""); // Initialize with empty string or appropriate default
  const [userName,setUserName] = useState<string  | string>("")
  const apiUrl = '/api/menu'; // Example API endpoint

  useEffect(() => {
    // Retrieve the roleId from localStorage on the client side
    const roleId = localStorage.getItem('roleId');
    const userName =  localStorage.getItem('userName');
    setCurrentUserRoleId(roleId ? Number(roleId) : ""); // Update state with roleId or empty string
    setUserName(userName||"")
  }, []); // Empty dependency array to run this effect only once

  return (
    <>
      <Navbar url={apiUrl} userRoleId={Number(currentUserRoleId)} userName={userName} />
      {/* Other content */}
    </>
  );
}
