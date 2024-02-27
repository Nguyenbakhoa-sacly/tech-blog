import React from 'react'
import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  return (
    <div className='pt-61px'>
      <div className=' p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form className='flex flex-col gap-4' action="">
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
            <Select>
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
          <div className='flex gap-4 p-3 items-center justify-between border-4 border-teal-500 border-dotted'>
            <FileInput type='file' accept='image' />
            <Button
              type='button'
              outline
              gradientDuoTone='purpleToBlue' size='sm'>
              Upload image
            </Button>
          </div>
          <ReactQuill
            theme='snow'
            placeholder='Write something...'
            className='h-72 mb-12'
          />
          <Button type='submit' gradientDuoTone='purpleToPink'>
            Post
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
