import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    try {
      (async () => {
        const res = await fetch(`
          /api/v1/post/getposts`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      }
      )()
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <div className=' pt-61px'>
      <div>
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Blog</h1>
          <p className='text-gray-500 text-xs sm:text-sm'>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programing languages.</p>
          <Link to='/search' className='text-xs sm:text-sm  font-bold hover:underline'>
            View all posts
          </Link>
        </div>
        <div className='p-3'>
          <CallToAction />
        </div>
        <div className='max-w-6xl mx-auto p-3 gap-8 py-7 flex flex-col'>
          {
            posts && posts.length > 0 && (
              <div className='flex flex-col gap-6'>
                <h2 className='text-2xl text-center font-semibold'>Recent Posts</h2>
                <div className='flex flex-wrap gap-4'>
                  {
                    posts.map((post) =>
                      <PostCard key={post._id} post={post} />
                    )
                  }
                </div>
                <Link to='/search' className='text-lg  hover:underline text-center'>
                  View all posts
                </Link>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Home
