"use client"
import { AuthContext } from '@/context/auth-context'
import { Button } from '@mui/material'
import { useContext } from 'react'

function Profile() {
  const { currentUser, signOut } = useContext(AuthContext)
   console.log(currentUser)
  return(
    <div className='min-h-screen flex justify-center items-center'>
    <div className='border p-10 flex flex-col gap-3'>
      <h3 className='text-2xl'> Welcome! {currentUser?.displayName}</h3>
      <h3 className='text-2xl'> Email! {currentUser?.email}</h3>
      <p className='text-2xl'>Sign In Status: {currentUser && 'active'}</p>
      <Button className="bg-black w-full mt-3 text-white hover:text-gray-800 text-xl" onClick={signOut}>Sign Out</Button>
    </div>
    </div>
  )
}
export default Profile
