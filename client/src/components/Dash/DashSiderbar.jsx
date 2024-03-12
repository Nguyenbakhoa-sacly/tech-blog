import React, { useEffect, useState } from 'react'
import { Sidebar } from 'flowbite-react';
import { HiArrowCircleRight, HiUser, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutSuccess } from '../../redux/user/userSlice';

const DashSiderbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search])

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/v1/user/signout`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess())
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {currentUser.isAdmin &&
            <Link to={'/dashboard?tab=dash'}>
              <Sidebar.Item
                as='div'
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                labelColor='dark'>
                Dashboard
              </Sidebar.Item>
            </Link>
          }
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item
              as='div'
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor={currentUser.isAdmin ? 'success' : 'dark'}>
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin &&
            <Link to={'/dashboard?tab=posts'}>
              <Sidebar.Item
                as='div'
                active={tab === 'posts'}
                icon={HiDocumentText}
                labelColor='dark'>
                Posts
              </Sidebar.Item>
            </Link>
          }
          {currentUser.isAdmin &&
            <Link to={'/dashboard?tab=comments'}>
              <Sidebar.Item
                as='div'
                active={tab === 'comments'}
                icon={HiAnnotation}
                labelColor='dark'>
                Comments
              </Sidebar.Item>
            </Link>
          }
          {currentUser.isAdmin &&
            <Link to={'/dashboard?tab=users'}>
              <Sidebar.Item
                as='div'
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                labelColor='dark'>
                Users
              </Sidebar.Item>
            </Link>
          }
          <Sidebar.Item
            onClick={handleSignOut}
            className='cursor-pointer'
            icon={HiArrowCircleRight}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar >
  )
}

export default DashSiderbar
