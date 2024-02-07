import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData(
      { ...formData, [e.target.id]: e.target.value.trim() });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('http://localhost:3000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message)
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in')
      }
    } catch (e) {
      setErrorMessage(e.message);
    }
  }
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
            <form action="" onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div>
                <Label htmlFor='username'
                  value='Your username' />
                <TextInput
                  type='text'
                  placeholder='Username'
                  id='username'
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor='email'
                  value='Your email' />
                <TextInput
                  type='text'
                  placeholder='name@example.com'
                  id='email'
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor='password'
                  value='Your password' />
                <TextInput
                  type='text'
                  placeholder='Password'
                  id='password'
                  onChange={handleChange}
                />
              </div>
              <Button disabled={loading}
                type='submit'
                gradientDuoTone="purpleToPink">
                {
                  loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-2'>Loading...</span>
                    </>
                  ) :
                    'Sign Up'
                }
              </Button>
              <OAuth />
            </form>
            <div className='flex gap-2 text-sm mt-5'>
              <span>Have an account?</span>
              <Link to='/sign-in'
                className='text-blue-500 '>
                Sign In
              </Link>
            </div>
            {
              errorMessage && (
                <Alert className='mt-5' color='failure'>
                  {errorMessage}
                </Alert>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
