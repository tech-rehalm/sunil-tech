"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Page() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {data: session} = useSession()

    useEffect(()=>{
      if(session){
        router.push("/")
      }
    })

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const user = { firstname, lastname, email, password };

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Registration failed");
        }

        // Success
        toast.success("Registration successful");
        router.push("/signin");

      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "An unexpected error occurred");
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false); // Ensure loading state is reset
      }
    };

    return (
      <div className='container flex items-center justify-center center min-h-screen'>
        <form onSubmit={submitHandler} className='w-full md:w-[350px] lg:w-[350px] border border-gray-600 xl:w-[350px]  rounded-xl bg-gray-900 shadow-xl shadow-gray-900  p-6'>
          <h1 className="title text-yellow-500 my-2">Sign up now</h1>
          
          <div className='wrapper'>
            <label htmlFor="firstname" className="label">First name</label>
            <input
              required
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className='input w-full rounded-xl bg-slate-800 focus:outline-none p-2 text-violet-300 font-bold'
            />
          </div>

          <div className='wrapper'>
            <label htmlFor="lastname" className="label">Last name</label>
            <input
              required
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className='input w-full rounded-xl bg-slate-800 focus:outline-none p-2 text-violet-300 font-bold'
            />
          </div>

          <div className='wrapper'>
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='input w-full rounded-xl bg-slate-800 focus:outline-none p-2 text-violet-300 font-bold'
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
            className="w-full rounded-xl bg-yellow-500 hover:bg-yellow-600 py-2 my-2 text-indigo-950 btn" 
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <p className="my-3 font-semibold text-slate-400">
            Already have an account? <Link href="/signin" className='text-yellow-500 underline'>Signin</Link>
          </p>
        </form>
      </div>
    );
}
