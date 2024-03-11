import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSiderbar from '../components/Dash/DashSiderbar';
import DashProfile from '../components/Dash/DashProfile';
import DashPosts from '../components/Dash/DashPosts';
import DashUsers from '../components/Dash/DashUsers';
import DashComment from '../components/Dash/DashComment';
const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
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
        {tab === 'users' && <DashUsers />}
        {tab === 'comments' && <DashComment />}
      </div>
    </>
  )
}

export default Dashboard
