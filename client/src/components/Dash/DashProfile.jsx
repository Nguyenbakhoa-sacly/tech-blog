import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable }
  from 'firebase/storage'
import app from '../../utils/firebase/Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const DashProfile = () => {
  const { currentUser } = useSelector(state => state.user);
  const filePickerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUpLoadProgress, setImageFileUpLoadProgress] = useState(null);
  const [imageFileUpLoadError, setImageFileUpLoadError] = useState(null);
  console.log(imageFileUpLoadProgress, imageFileUpLoadError)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

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
    setImageFileUpLoadError(null)
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            setImageFileUrl(downloadUrl)
          })
      }
    )
  }
  return (
    <>
      <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form action="" className='flex flex-col gap-4 '>
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
          <TextInput
            type='username'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
          />
          <TextInput
            type='email'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
          />
          <TextInput
            type='password'
            id='password'
            placeholder='password'
          />
          <Button type='submit' gradientDuoTone='purpleToBlue' outline>
            Update
          </Button>
        </form>
        <div className='text-red-500 mt-4 text-sm flex justify-between'>
          <p className='cursor-pointer'>Delete Account</p>
          <p className='cursor-pointer'>Sign Out</p>
        </div>
      </div>
    </>

  )
}

export default DashProfile