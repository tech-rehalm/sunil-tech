"use client"

import AdminLayout from '@/components/AdminLayout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Layout({children}: {children: React.ReactNode}) {
  const {data: session} = useSession()
  const router = useRouter()
  if(!session?.user.isAdmin){
    router.push("/")
  }
  return (
    <div className='w-full min-h-screen p-5'>
      <AdminLayout/>
      <div className="ml-[200px]">
        {children}
      </div>  
    </div>
  )
}
