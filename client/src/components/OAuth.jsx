import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import app from '../utils/firebase/Firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
  const auth = getAuth(app)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" })
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider)
      console.log(resultFromGoogle);
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL,
        })
      })
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Button type='button' outline
        onClick={handleGoogleClick}
        gradientDuoTone='pinkToOrange'>
        <AiFillGoogleCircle className='w-6 h-6 mr-2' />
        Continue with Google
      </Button>
    </>
  )
}

export default OAuth
