import { Button, Modal } from 'flowbite-react'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { deleteStart, deleteSuccess, deleteError } from '../redux/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const ModalDelete = ({ showModal, setShowModal }) => {
  // delete the user account
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const handleDeleteUser = async () => {
    setShowModal();
    try {
      dispatch(deleteStart());
      const res = await fetch(`http://localhost:3000/api/v1/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteError(data.message));
      } else {
        dispatch(deleteSuccess());
      }
    } catch (e) {
      dispatch(deleteError(e.message));
    }
  };
  return (
    <>
      <Modal
        show={showModal}
        onClose={setShowModal}
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
                onClick={handleDeleteUser}>
                Yes,I'm sure
              </Button>
              <Button
                color='yellow'
                onClick={setShowModal}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ModalDelete
