import React, { useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import app from '../utils/firebase/Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';


const CreatePost = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUpLoadProgress, setImageUpLoadProgress] =
    useState(null);
  const [imageUpLoadError, setImageUpLoadError] =
    useState(null);
  const [formData, setFormData] = useState({});
  const [createPostError, setCreatePostError] = useState(null);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/post/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreatePostError(data.message);
        return;
      }
      if (res.ok) {
        setCreatePostError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (e) {
      setCreatePostError('Something went wrong');
    }
  }
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUpLoadError('Please select an image');
        return;
      }
      setImageUpLoadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          setImageUpLoadProgress(progress.toFixed(0))
        },
        (error) => {
          setImageUpLoadError('Image upload failed');
          setImageUpLoadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
              setImageUpLoadProgress(null);
              setImageUpLoadError(null);
              setFormData({ ...formData, image: downloadUrl });
            });
        }
      );
    } catch (e) {
      setImageUpLoadError('Image upload failed');
      setImageUpLoadProgress(null);
    }
  }
  return (
    <div className='pt-61px'>
      <div className=' p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmitPost} action="">
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput
              onChange={(e) => setFormData(
                { ...formData, title: e.target.value })}
              type='text' placeholder='Title' required id='title' className='flex-1' />
            <Select
              onChange={(e) => setFormData(
                { ...formData, category: e.target.value })}
            >
              <option
                value='uncategorized'>Select a category</option>
              <option
                value='javascript'>JavaScript</option>
              <option
                value='reactjs'>React JS</option>
              <option
                value='nodejs'>Node JS</option>
              <option
                value='nextjs'>Next JS</option>
            </Select>
          </div>
          <div className='flex gap-4 p-3 items-center justify-between border-2 border-teal-500 border-dotted'>
            <FileInput
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              accept='image' />
            <Button
              onClick={handleUploadImage}
              type='button'
              outline
              disabled={imageUpLoadProgress}
              gradientDuoTone='purpleToBlue' size='sm'>
              {
                imageUpLoadProgress ? (
                  <div className='w-8 h-8'>
                    <CircularProgressbar
                      value={imageUpLoadProgress}
                      text={`${imageUpLoadProgress || 0}% `}
                    />
                  </div>
                ) : (
                  'Upload Image'
                )
              }
            </Button>
          </div>
          {imageUpLoadError && (
            <Alert color='failure'>
              {imageUpLoadError}
            </Alert>
          )}
          {
            formData.image && (
              <img
                src={formData.image}
                alt='upload'
                className='w-full h-72 object-cover'
              />
            )
          }
          <ReactQuill
            onChange={(value) => setFormData(
              { ...formData, content: value })}
            theme='snow'
            required
            placeholder='Write something...'
            className='h-72 mb-12'
          />
          <Button
            type='submit'
            gradientDuoTone='purpleToPink'>
            Post
          </Button>
          {
            createPostError && (
              <Alert color='failure'>
                {createPostError}
              </Alert>
            )
          }
        </form>
      </div>
    </div>
  )
}

export default CreatePost
