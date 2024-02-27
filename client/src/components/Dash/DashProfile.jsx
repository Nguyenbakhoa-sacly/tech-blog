import { Alert, Button, Modal, TextInput }
  from 'flowbite-react';
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react'
import ModalDelete from '../ModalDelete';
import app from '../../utils/firebase/Firebase';
import 'react-circular-progressbar/dist/styles.css';
import {
  getDownloadURL, getStorage, ref,
  uploadBytesResumable
} from 'firebase/storage'
import {
  updateError, updateStart,
  updateSuccess, signOutSuccess
} from '../../redux/user/userSlice';
import { CircularProgressbar } from 'react-circular-progressbar';

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector(state => state.user);
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUpLoadProgress, setImageFileUpLoadProgress] = useState(null);
  const [imageFileUpLoadError, setImageFileUpLoadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updatedUserError, setUpdatedUserError] = useState(null);
  //show modal delete
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  const handleOnchange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(null);
    setUpdatedUserError(null);
    if (Object.keys(formData).length === 0) {
      setUpdatedUserError('No changes made');
      return;
    };
    if (imageFileUploading) {
      setUpdatedUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`http://localhost:3000/api/v1/user/update/${currentUser._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateError(data.message));
        setUpdatedUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('User profile updated successfully')
      }
    } catch (e) {
      dispatch(updateError(e.message));
      setUpdatedUserError(e.message);
    }
  };
  const handleSignOut = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/user/signout`, {
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
  useEffect(() => {
    if (imageFile) {
      upLoadImage();
    }
  }, [imageFile]);
  const upLoadImage = () => {
    // service firebase.storage {
    //   match / b / { bucket } / o {
    //     match / { allPaths=**} {
    //   allow read;
    //   allow write: if
    //   request.resource.size < 2 * 1024 * 1024 &&
    //   request.resource.contentType.matches('image/.*')
    // }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUpLoadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUpLoadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUpLoadError('Could not upload image (File must be less than 2MB)')
        setImageFileUpLoadProgress(null);
        setImageFileUrl(null);
        setImageFile(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            setImageFileUrl(downloadUrl);
            setFormData({ ...formData, profilePicture: downloadUrl });
            setImageFileUploading(false);
          })
      }
    )
  };
  return (
    <>
      <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form action="" onSubmit={handleSubmitUpdate} className='flex flex-col gap-4 '>
          <input type='file' accept='image/*'
            onChange={handleImageChange}
            ref={filePickerRef} hidden />
          <div className='w-32 h-32 relative self-center cursor-pointer shadow-md overflow-hidden rounded-full'
            onClick={() => filePickerRef.current.click()}
          >
            {
              imageFileUpLoadProgress && (
                <CircularProgressbar
                  value={imageFileUpLoadProgress || 0}
                  text={`${imageFileUpLoadProgress || 0}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${imageFileUpLoadProgress / 100
                        })`,
                    },
                  }}
                />
              )
            }
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="User"
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUpLoadProgress &&
                imageFileUpLoadProgress < 100 &&
                'opacity-60'
                }`} />
          </div>

          {imageFileUpLoadError &&
            <Alert color='failure'>
              {imageFileUpLoadError}
            </Alert>
          }
          {
            updateUserSuccess && (
              <Alert color='success' >
                {updateUserSuccess}
              </Alert>
            )
          }
          {
            updatedUserError && (
              <Alert color='failure'>
                {updatedUserError}
              </Alert>
            )
          }
          {
            error && (
              <Alert color='failure'>
                {error}
              </Alert>
            )
          }
          <TextInput
            type='username'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
            onChange={handleOnchange}
          />
          <TextInput
            type='email'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleOnchange}
          />
          <TextInput
            type='password'
            id='password'
            placeholder='password'
            onChange={handleOnchange}
          />
          <Button
            type='submit'
            disabled={loading || imageFileUploading}
            gradientDuoTone='purpleToBlue' outline>
            {loading ? 'Loading...' : 'Update'}
          </Button>
          {currentUser.isAdmin && (
            <Link to='/create-post'>
              <Button
                type='button'
                className='w-full'
                gradientDuoTone='purpleToPink' outline>
                Create a post
              </Button>
            </Link>
          )
          }
        </form>
        <div className='text-red-500 mt-4 text-sm flex justify-between'>
          <p onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</p>
          <p onClick={handleSignOut} className='cursor-pointer'>Sign Out</p>
        </div>
        <ModalDelete
          setShowModal={() => setShowModal(false)}
          showModal={showModal} />
      </div >
    </>

  )
}

export default DashProfile
