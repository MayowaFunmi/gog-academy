'use client'

import React, { useEffect } from 'react'
import { FiBell } from "react-icons/fi";
import Image from 'next/image';
import { useSignOutUser } from '@/app/hooks/auth';
import { signOut } from 'next-auth/react';
import { success_notify } from '@/app/utils/constants';

const TopNavbar = () => {

  const { mutate: logOut, isSuccess } = useSignOutUser();
  const handleSignOut = () => {
    logOut();
  }

  useEffect(() => {
    if (isSuccess) {
      success_notify("You have successfully logged out");
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [isSuccess]);

  return (
    <div className='shadow-md bg-white fixed top-0 left-[20%] w-[80%] z-50 px-4 py-3'>
      <div className='w-full flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <Image src='/assets/images/gog-logo.png' alt='GOG Academy Logo' width={40} height={40} className='rounded-full' />
          <span className='hidden lg:block text-gray-700 text-lg font-semibold whitespace-nowrap'>Welcome to GOG Academy</span>
        </div>

        <div className='flex justify-end gap-5 w-full'>
          <div className='relative cursor-pointer'>
            <FiBell size={25} color='#374151' />
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </div>
          </div>

          <div
            className='text-red-700 cursor-pointer'
            onClick={handleSignOut}
          >
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavbar
