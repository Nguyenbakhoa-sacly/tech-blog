import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <>
      <div className='min-h-screen pt-36'>
        <div className='flex gap-5 flex-col md:flex-row md:items-center px-2 max-w-3xl m-auto'>
          {/* left */}
          <div className='flex-1'>
            <Link to={'/'}
              className=' text-4xl font-bold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
          via-purple-500 to-pink-500 rounded-lg text-white'>Technology</span>
              Blog
            </Link>
            <p className='text-sm font-medium mt-5'>
              This is a demo project. You can sign up with your email and password or with Google.
            </p>
          </div>
          {/* right */}
          <div className='flex-1'>
            <form action="" className='flex flex-col gap-4'>
              <div>
                <Label htmlFor='username'
                  value='Your username' />
                <TextInput
                  type='text'
                  placeholder='Username'
                  id='username'
                />
              </div>
              <div>
                <Label htmlFor='email'
                  value='Your email' />
                <TextInput
                  type='text'
                  placeholder='name@example.com'
                  id='email'
                />
              </div>
              <div>
                <Label htmlFor='password'
                  value='Your password' />
                <TextInput
                  type='text'
                  placeholder='Password'
                  id='password'
                />
              </div>
              <Button type='submit'
                gradientDuoTone="purpleToPink">
                Sign Up
              </Button>
            </form>
            <div className='flex gap-2 mt-5'>
              <span>Have an account?</span>
              <Link to='/sign-in'
                className='text-blue-500 text-sm'>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
