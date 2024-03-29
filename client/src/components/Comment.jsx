import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Textarea, Button } from 'flowbite-react'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux';
const Comment = ({ key, comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { currentUser } = useSelector(state => state.user)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/v1/user/${comment.userId}`)
        const data = await res.json();
        if (res.ok) {
          setUser(data)
        }
      } catch (e) {
        console.log(e.message);
      }
    })()
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/v1/comment/editcomment/${comment._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editContent);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div
      className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username} />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'User name'}</span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {
          isEditing ? (
            <>
              <Textarea
                className='mb-2'
                rows='3'
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className='flex justify-end gap-2 text-xs'>
                <Button
                  onClick={() => setIsEditing(false)}
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToPink'
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className='text-gray-500 pb-2'>{comment.content}</p>
              <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                <button
                  type='button'
                  onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 
            ${currentUser &&
                    comment.likes.includes(currentUser._id) && '!text-blue-500'} `}>
                  <FaThumbsUp className='text-sm' />
                </button>
                <p className='text-gray-400'>
                  {comment.numberOfLikes > 0
                    && comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                </p>
                {
                  currentUser && (currentUser._id === currentUser.userId || currentUser.isAdmin) && (
                    <>
                      <button type='button'
                        onClick={handleEdit}
                        className='text-gray-400 hover:text-blue-500'>
                        Edit
                      </button>
                      <button type='button'
                        onClick={() => onDelete(comment._id)}
                        className='text-gray-400 hover:text-red-500'>
                        Delete
                      </button>
                    </>
                  )
                }
              </div>
            </>
          )
        }
      </div>
    </div >
  )
}

export default Comment
