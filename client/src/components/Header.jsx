import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, DropdownDivider, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutSuccess } from '../redux/user/userSlice';

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  return (
    <>
      <Navbar className='border-b-2 fixed w-full z-50'>
        <Link to={'/'} className='self-center whitespace-nowrap text-sm
        sm:text-xl font-semibold dark:text-white'>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
          via-purple-500 to-pink-500 rounded-lg text-white'>Technology</span>
          Blog
        </Link>
        <form onSubmit={handleSubmit}
          className='flex items-center  gap-4'>
          <TextInput
            type="text"
            placeholder="Search..."
            className='hidden lg:inline w-96'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type='submit'
            className="w-12 h-10 "
            pill color='gray'>
            <AiOutlineSearch />
          </Button>
        </form>
        <div className='flex gap-2 md:order-2'>
          <Button
            onClick={() => dispatch(toggleTheme())}
            className='w-12 h-10 hidden sm:inline' pill color='gray'>
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </Button>
          {
            currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt='user'
                    img={currentUser.profilePicture}
                    rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className='block text-sm'>{currentUser.username}</span>
                  <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                </Dropdown.Header>
                <Link to={'/dashboard?tab=dash'}>
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                </Link>
                <Link to={'/dashboard?tab=profile'}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <DropdownDivider />
                <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
              </Dropdown>
            ) : (
              <Link to={'/sign-in'}>
                <Button gradientDuoTone='purpleToBlue' outline>
                  Sign In
                </Button>
              </Link>
            )
          }
          {/* hiện thị thanh navbar */}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as='div'>
            <Link to={'/'}>
              Home
            </Link>
          </Navbar.Link >
          <Navbar.Link active={path === "/about"} as='div'>
            <Link to={'/about'}>
              About
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/project"} as='div'>
            <Link to={'/project'}>
              Projects
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Header
