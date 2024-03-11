

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashComment = () => {
  const { currentUser } = useSelector(state => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdDelete, setCommentIdDelete] = useState('')
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(
          `/api/v1/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (currentUser.isAdmin) {
      fetchComment();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/v1/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/v1/comment/deletecomment/${commentIdDelete}`,
        {
          method: 'DELETE',
          credentials: 'include',
        });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);

      }
    } catch (e) {
      console.log(e.message);
    }
  }
  return (
    <>
      <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
      dark:scrollbar-thumb-slate-500'>
        {
          currentUser.isAdmin && comments.length > 0 ?
            (
              <>
                <Table hoverable className='shadow-md'>
                  <TableHead>
                    <TableHeadCell>Data updated</TableHeadCell>
                    <TableHeadCell>Comment content</TableHeadCell>
                    <TableHeadCell>Number of likes</TableHeadCell>
                    <TableHeadCell>PostID</TableHeadCell>
                    <TableHeadCell>UserID</TableHeadCell>
                    <TableHeadCell>Delete</TableHeadCell>
                  </TableHead>
                  {
                    comments.map((comment) => (
                      <TableBody key={comment._id} className='divide-y'>
                        <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                          <TableCell>
                            {new Date(comment.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {comment.content}
                          </TableCell>
                          <TableCell>
                            {comment.numberOfLikes}
                          </TableCell>
                          <TableCell>
                            {comment.postId}
                          </TableCell>
                          <TableCell>
                            {comment.userId}
                          </TableCell>
                          <TableCell >
                            <span
                              onClick={() => {
                                setShowModal(true)
                                setCommentIdDelete(comment._id)
                              }}
                              className='font-medium text-red-500 hover:underline cursor-pointer'> Delete</span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ))
                  }
                </Table>
                {
                  showMore && (
                    <button
                      onClick={handleShowMore}
                      className='w-full py-7 text-teal-500 self-center text-sm'>
                      Show more
                    </button>
                  )
                }
              </>
            ) :
            (
              <div>
                <p>You have no comment yet?</p>
              </div>
            )
        }
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size='md'
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle
                className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete this comment?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button
                  color='failure'
                  onClick={handleDeleteComment}>
                  Yes,I'm sure
                </Button>
                <Button
                  color='yellow'
                  onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div >
    </>
  )
}

export default DashComment

