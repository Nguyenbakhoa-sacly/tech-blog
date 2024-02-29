import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { Link } from 'react-router-dom'
const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user);
  const [userPosts, setUserPosts] = useState([]);
  console.log(userPosts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
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
                          <TableCell>
                            <span className='font-medium text-red-500 hover:underline cursor-pointer'> Delete</span>
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
              </>
            ) :
            (
              <div>
                <p>You have n post yet?</p>
              </div>
            )
        }

      </div >
    </>
  )
}

export default DashPosts
