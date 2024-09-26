"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react'

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {data: session} = useSession()

    useEffect(()=>{
      if(session && session.user){
        console.log(session?.user);
        router.push("/")
      }
    })

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        signIn("credentials",{
          email, password
        })
        router.push("/")
      } catch (error) {
        console.log(error);
        
        toast.error("Failed to sign in")
      }
    };

    return (
      <div className='container center min-h-screen flex items-center justify-center '>
        <form onSubmit={submitHandler} className='w-full md:w-[350px] lg:w-[350px] border border-gray-600 xl:w-[350px]  rounded-xl bg-gray-900 shadow-xl shadow-gray-900  p-6'>
          <h1 className="title text-yellow-500 my-2">Sign in</h1>

          <div className='wrapper'>
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='input w-full rounded-xl bg-slate-800  focus:outline-none p-2 text-violet-300 font-bold'
            />
          </div>

          <div className='wrapper'>
            <label htmlFor="password" className="label">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='input w-full rounded-xl bg-slate-800 focus:outline-none p-2 text-violet-300 font-bold'
            />
          </div>

          <button 
            className="w-full rounded-xl my-3 bg-yellow-500 hover:bg-yellow-600 py-2 text-indigo-950 btn" 
            disabled={loading}
            onClick={()=> setLoading(true)}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="my-3 font-semibold text-slate-400">
            Dosn't have an account? <Link href="/register" className='text-yellow-500 underline'>Sign up</Link>
          </p>
        </form>
      </div>
    );
}
