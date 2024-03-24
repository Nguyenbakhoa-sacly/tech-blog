import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react'
import { IoIosChatboxes } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LiveChat = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value.trim()
    })
  }
  const handleSendEmail = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/v1/email/sendemail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await res.json();
    if (res.ok) {
      toast.success('Send message successfully!')
    }
    else {
      toast.error('Send message successfully!')
    }
  }
  return (
    <>
      {
        show && (
          <>
            <div className=' border rounded-md bg-slate-300 max-w-xs w-80 p-3 fixed right-10 bottom-40 '>
              <form action="" onSubmit={handleSendEmail} className='flex flex-col '>
                <div className='font-semibold  pt-3 pb-3'>
                  Send Message
                </div>
                <div className='mb-3'>
                  <Label htmlFor='yourname'
                    value='Your Name' />
                  <TextInput
                    id='yourname'
                    onChange={handleChange}
                    type="text" />
                </div>
                <div className='mb-3'>
                  <Label htmlFor='email'
                    value='Email Address' />
                  <TextInput
                    id='email'
                    onChange={handleChange}
                    type="text" />
                </div>
                <div className='mb-3'>
                  <Label htmlFor='message'
                    value='Message' />
                  <Textarea
                    id='message'
                    onChange={handleChange}
                    type="text" />
                </div>
                <Button
                  type='submit'
                  className=''>Send Message</Button>
              </form>
            </div>
            <ToastContainer />
          </>
        )
      }
      {/* box chat */}

      <div className='fixed right-10 bottom-20 '>
        <div
          onClick={() => setShow(!show)}
          className='flex cursor-pointer bg-slate-600 rounded-full justify-center items-center w-14 h-14 border-[1px]'>
          <IoIosChatboxes className='text-lg text-white' />
        </div>
      </div>
    </>
  )
}

export default LiveChat
