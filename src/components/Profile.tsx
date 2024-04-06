"use client"

import { AuthContext } from '@/context/auth-context'
import { Avatar, Button } from '@mui/material'
import { updateProfile } from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

function Profile() {
  const { currentUser} = useContext(AuthContext)
  const storage = getStorage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
  const [displayName, setDisplayName] = useState<string>(currentUser?.displayName || ''); 
   useEffect(()=>{
    setDisplayName(currentUser?.displayName || "")
    setAvatarUrl(currentUser?.photoURL || null)
},[currentUser])
   
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0]
    if (files) {
      uploadFile(files);
    }
  }

  const uploadFile = (file: File) => {
    const mountainsRef = ref(storage, `${currentUser?.uid}/${file?.name}`);
    try {
      uploadBytes(mountainsRef, file).then((snapshot) => {
        toast.success('File uploaded successfully');
        updateAvatarUrl(mountainsRef);  
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const updateAvatarUrl = (mountainsRef: StorageReference) => {
    getDownloadURL(mountainsRef).then((url) => {
      setAvatarUrl(url); 
    }).catch((error) => {
      console.error('Error getting download URL:', error);
    });
  }

  const handleUpdate = async () => {
    if(currentUser){
      try {
        await updateProfile(currentUser!, {
          displayName: displayName,
          photoURL: avatarUrl,
        });
        sessionStorage.setItem("avatar",avatarUrl as string)
        toast.success("Profile updated successfully!");

      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  }

  return (
    <div className='flex flex-col items-center mt-3'>
      <div className='border p-10'>
        <div className='flex flex-col justify-center items-center'>
          <Avatar sx={{ width: 200, height: 200 }} alt="m" src={ avatarUrl || currentUser?.photoURL as string}></Avatar>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFile}
          />
          <label htmlFor="raised-button-file">
            <Button component="span" variant="contained" className='mt-2'>
              Upload
            </Button>
          </label>
        </div>
        <div className='flex flex-col gap-3 mt-3'>
          <div className='w-full flex justify-between'>
            <label>Display Name</label>
            <input
              className="border rounded-md p-2 ms-3"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          {/* <div className='w-full flex justify-between'>
            <label>Phone Number</label>
            <input
              className="border rounded-md p-2 ms-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div> */}
          <div className='w-full flex justify-between'>
            <label>Email</label>
            <input
              disabled
              className="border rounded-md p-2 ms-4"
              value={currentUser?.email as string}
            />
          </div>
          <Button variant='contained' onClick={handleUpdate}>Update Profile</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile

