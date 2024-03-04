import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaUser, FaUserShield } from "react-icons/fa";
const DashUsers = () => {
  const { currentUser } = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdDelete, setUserIdDelete] = useState('')
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/v1/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/v1/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = fetch(`/api/v1/user/deleteuser/${userIdDelete}/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) =>
          prev.filter((user) => user._id != userIdDelete)
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
          currentUser.isAdmin && users.length > 0 ?
            (
              <>
                <Table hoverable className='shadow-md'>
                  <TableHead>
                    <TableHeadCell>Data created</TableHeadCell>
                    <TableHeadCell>User image</TableHeadCell>
                    <TableHeadCell>Username</TableHeadCell>
                    <TableHeadCell>Email</TableHeadCell>
                    <TableHeadCell>Admin</TableHeadCell>
                    <TableHeadCell>Delete</TableHeadCell>
                  </TableHead>
                  {
                    users.map((user) => (
                      <TableBody key={user._id} className='divide-y'>
                        <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <img
                              className='w-10 h-10 rounded-full object-cover bg-gray-500'
                              src={user.profilePicture}
                              alt={user.username}
                            />
                          </TableCell>
                          <TableCell> {user.username}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.isAdmin
                              ? <FaUserShield className='text-green-500 w-5 h-5' />
                              : <FaUser className='text-red-500 w-5 h-5' />}</TableCell>
                          <TableCell
                            onClick={
                              () => setUserIdDelete(user._id)}>
                            <span
                              onClick={
                                () => setShowModal(true)
                              }
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
                <p>You have no user yet?</p>
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
                Are you sure you want to delete this user?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button
                  color='failure'
                  onClick={handleDeleteUser}>
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

export default DashUsers
