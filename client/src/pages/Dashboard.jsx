import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSiderbar from '../components/Dash/DashSiderbar';
import DashProfile from '../components/Dash/DashProfile';
import DashPosts from '../components/Dash/DashPosts';
const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search])
  return (
    <>
      <div className='pt-61px min-h-screen flex flex-col md:flex-row '>
        {/* Siderbar */}
        <div className='md:w-56'>
          <DashSiderbar />
        </div>
        {/* profile */}
        {tab === 'profile' && <DashProfile />}
        {tab === 'posts' && <DashPosts />}
      </div>
    </>
  )
}

export default Dashboard
