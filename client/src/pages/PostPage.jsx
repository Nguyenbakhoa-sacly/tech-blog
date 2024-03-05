import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
const PostPage = () => {
  const { postslug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`
        /api/v1/post/getposts?slug=${postslug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        } else {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    })()
  }, [postslug]);
  console.log(post);
  if (loading) {
    return (
      <>
        <div className='flex justify-center items-center min-h-screen'>
          <Spinner size='xl' />
        </div>
      </>
    )
  }
  return (
    <>
      <div className='pt-61px'>
        <div className='p-3 flex max-w-6xl flex-col mx-auto min-h-screen'>
          <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xll mx-auto lg:text-4xl'>
            {post && post.title}</h1>
          <Link className='mt-5 self-center'
            to={`/search?category=${post && post.category}`}>
            <Button color='gray' pill size='xs' >
              {post && post.category}</Button>
          </Link>
          <img
            className='mt-10 p-3 max-h-[600px] w-full object-cover'
            src={post && post.image}
            alt={post && post.title} />
          <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>
              {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <div
            className='p-3 max-w-2xl mx-auto w-full post-content'
            dangerouslySetInnerHTML={
              { __html: post && post.content }}>

          </div>
        </div>
      </div>
    </>
  )
}

export default PostPage