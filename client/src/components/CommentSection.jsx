import { Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
const CommentSection = ({ postId }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState('');
  const { currentUser } = useSelector(state => state.user);
  console.log(comments)
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return
    try {
      const res = await fetch(`/api/v1/comment/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(
          {
            content: comment,
            postId,
            userId: currentUser._id
          }
        )
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (e) {
      setCommentError(e.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`
        /api/v1/comment/getpostcomments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (e) {
        console.log(e.message);
      }
    })()
  }, []);

  const handleOnlike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/v1/comment/likecomment/${commentId}`, {
        method: 'put',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map(comment =>
          comment._id === commentId
            ? {
              ...comment,
              likes: data.likes,
              numberOfLikes: data.likes.length,
            }
            : comment
        ))
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
          <Link
            className='text-xs text-cyan-600 hover:underline'
            to={'/dashboard?tab=profile'}>
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div
          className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link
            className='text-blue-500 hover:underline'
            to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {
        currentUser && (
          <>
            <form
              onSubmit={handleSubmitComment}
              className='border border-teal-500 rounded-md p-3'>
              <Textarea
                placeholder='Add a comment...'
                rows='3'
                maxLength='200'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div
                className='flex justify-between items-center mt-5'>
                <p className='text-gray-500 text-xs'>
                  {200 - comment.length} characters remaining</p>
                <Button outline gradientDuoTone='purpleToBlue'
                  type='submit'
                >
                  Submit
                </Button>
              </div>
            </form>
            {
              commentError && (
                <Alert color='failure' className='mt-5'>
                  {commentError}
                </Alert>
              )
            }
            {
              comments.length == 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
              ) :
                (
                  <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                      <p>Comments</p>
                      <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                      </div>
                    </div>
                    {
                      comments.map(comment => (
                        <Comment
                          onLike={handleOnlike}
                          key={comment._id}
                          comment={comment}
                        />
                      ))
                    }
                  </>
                )
            }
          </>
        )
      }
    </div>
  )
}

export default CommentSection
