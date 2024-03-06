import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <>
      <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 flex flex-col justify-center'>
          <h2 className='text-2xl'>
            want to learn more about Javascript?
          </h2>
          <p className='text-gray-500 my-2'>
            Checkout thse ressource with 100 Javascript Projects
          </p>
          <Button
            className='rounded-tl-xl rounded-tr-none rounded-bl-none'
            rel='noopener noreferrer'
            gradientDuoTone='purpleToPink'>
            <a target='_blank'
              href="https://www.100jsprojects.com">
              100 JavaScript Projects
            </a>
          </Button>
        </div>
        <div className='p-7  flex-1'>
          <img
            className='rounded-md'
            src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png" alt="" />
        </div>
      </div>
    </>
  )
}

export default CallToAction
