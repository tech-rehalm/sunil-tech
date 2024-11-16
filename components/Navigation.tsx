"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import useCartService from '@/lib/hooks/useCartStore'
import { Home, ShoppingBag, ShoppingCart, UserPlus, LogIn, User, ChevronDown, Settings, LogOut } from 'lucide-react'

export default function Navigation() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const { items } = useCartService()

  useEffect(() => {
    setMounted(true)
  }, [])

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' })
  }

  return (
    <div className="navbar bg-slate-800 fixed top-0 z-30 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm text-warning dropdown-content mt-3 z-[1] p-2 shadow bg-slate-950 rounded-box w-52">
            <li><Link href="/" className='text-warning'><Home className="w-4 h-4 mr-2 " />Home</Link></li>
            <li><Link href="/shop"><ShoppingBag className="w-4 h-4 mr-2 " />Shop</Link></li>
            <li>
              <Link href="/cart">
                <ShoppingCart className="w-4 h-4 mr-2 " />
                Cart
                {mounted && items.length > 0 && (
                  <span className="badge badge-sm badge-warning">{items.reduce((a, c) => a + c.qty, 0)}</span>
                )}
              </Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl hidden sm:block">Sunny Tech Store</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/"><Home className="w-4 h-4 mr-2" />Home</Link></li>
          <li><Link href="/shop"><ShoppingBag className="w-4 h-4 mr-2" />Shop</Link></li>
          <li>
            <Link href="/cart">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {mounted && items.length > 0 && (
                <span className="badge badge-sm badge-warning ml-2">{items.reduce((a, c) => a + c.qty, 0)}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {!session?.user ? (
          <>
            <Link href="/register" className="btn btn-ghost btn-sm"><UserPlus className="w-4 h-4 mr-2" />Register</Link>
            <Link href="/signin" className="btn btn-warning btn-sm"><LogIn className="w-4 h-4 mr-2" />Sign in</Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-warning btn-circle avatar">
                <User />
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-slate-950 rounded-box w-52">
              <li>
                <Link href="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </li>
              {session.user.isAdmin && (
                <li>
                  <Link href="/admin">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <a onClick={signoutHandler}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}