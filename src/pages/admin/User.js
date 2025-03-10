import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAllUsers } from '../../redux/slices/userSlice';

const User = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getAllUsers());
    },[dispatch])

  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      hi users.
    </div>
    </div>
  )
}

export default User
