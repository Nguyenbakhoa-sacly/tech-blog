import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdDelete, setPostIdDelete] = useState('')
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  console.log(userPosts);
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = fetch(`http://localhost:3000/api/v1/post/deletepost/${postIdDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id != postIdDelete)
        )
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700
      dark:scrollbar-thumb-slate-500'>
        {
          currentUser.isAdmin && userPosts.length > 0 ?
            (
              <>
                <Table hoverable className='shadow-md'>
                  <TableHead>
                    <TableHeadCell>Data Update</TableHeadCell>
                    <TableHeadCell>Post image</TableHeadCell>
                    <TableHeadCell>Post title</TableHeadCell>
                    <TableHeadCell>Category</TableHeadCell>
                    <TableHeadCell>Delete</TableHeadCell>
                    <TableHeadCell>Edit</TableHeadCell>
                  </TableHead>
                  {
                    userPosts.map((post) => (
                      <TableBody className='divide-y'>
                        <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                          <TableCell>
                            {new Date(post.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Link to={`/post/${post.slug}`}>
                              <img
                                className='w-20 h-10 object-cover bg-gray-500'
                                src={post.image}
                                alt={post.title}
                              />
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link className='font-medium text-gray-900 dark:text-white'
                              to={`/post/${post.slug}`}>
                              {post.title}
                            </Link>
                          </TableCell>
                          <TableCell>{post.category}</TableCell>
                          <TableCell
                            onClick={
                              () => setPostIdDelete(post._id)}>
                            <span
                              onClick={
                                () => setShowModal(true)
                              }
                              className='font-medium text-red-500 hover:underline cursor-pointer'> Delete</span>
                          </TableCell>
                          <TableCell>
                            <Link
                              className='text-teal-500 hover:underline '
                              to={`/update-post/${post._id}`}>
                              <span> Edit</span>
                            </Link>
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
                <p>You have n post yet?</p>
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
                Are you sure you want to delete your account?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button
                  color='failure'
                  onClick={handleDeletePost}>
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

export default DashPosts
