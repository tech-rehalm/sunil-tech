"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { IoIosArrowDown } from "react-icons/io";
import useCartService from '@/lib/hooks/useCartStore';

export default function Navigation() {
  const {data: session}  = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { items } = useCartService()
  useEffect(() => {
    setMounted(true)
  }, [])

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' })
  }

  return (
    <div className='navbar justify-between bg-slate-900 z-30 text-yellow-500 pr-8 fixed top-0 mb-[80px]'>
      <div className="text-lg font-bold">Sunny Tech Store</div>
      <div className="flex gap-4">
        <Link href="/" className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-500 hover:text-black px-5 py-2 '>Home</Link>
        <Link href="/shop" className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-500 hover:text-black px-5 py-2 '>Shop</Link>
        <Link href="/cart" className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-500 hover:text-black px-5 py-2 '>Cart 
        {mounted && items.length != 0 && (
                <div className="badge badge-secondary">
                  {items.reduce((a, c) => a + c.qty, 0)}{' '}
                </div>
              )}
        </Link>
        {!session?.user && (
          <>
          <Link href="/register" className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-500 hover:text-black px-5 py-2 '>Register</Link>
        <Link href="/signin" className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-500 hover:text-black px-5 py-2 '>Sign in</Link>
          </>
        )}
        {session?.user && (
          <>
          <div className="flex">
            <button onClick={()=> setMenuOpen(!menuOpen)} className='font-semibold relative rounded-xl transition duration-500 hover:bg-yellow-500 hover:text-black px-5 py-2 flex text-lg'>
              {session?.user.firstname}<IoIosArrowDown />
              {menuOpen && (
                <div className="absolute top-8 right-1 border border-yellow-500 p-4 w-[170px] flex flex-col gap-4 bg-slate-800 shadow-xl rounded-xl z-40 text-yellow-500">
                  <Link className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-500 bg-slate-700 hover:text-black px-5 py-2 flex text-lg w-full' href='/profile'>Profile</Link>
                  {session?.user.isAdmin && (
                    <Link className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-500 bg-slate-700 hover:text-black px-5 py-2 flex text-lg w-full' href='/admin'>Admin</Link>
                  )}
                  <button onClick={signoutHandler} className='font-semibold rounded-xl transition duration-500 hover:bg-yellow-700 bg-yellow-500 text-black px-5 py-2 flex text-lg w-full'>Sign out</button>
                </div>
              )}
            </button>
            
          </div>
          </>
        )}
        
      </div>
    </div>
  )
} 