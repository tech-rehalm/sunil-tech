"use client"

import useCartService from '@/lib/hooks/useCartStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Page() {
    const router = useRouter()
    const {items, itemsPrice} = useCartService()

    const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>
  return (
    <div className='w-full min-h-screen p-10 '>
      {items.length === 0 ? (
        <h1 className="text-3xl font-extrabold">Your cart is empty go <Link href="/shop" className='underline'>shopping</Link></h1>
      ): (
        <div className="w-full">
            <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>
          Product Name
        </th>
        <th>Details</th>
        <th>Price</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item)=>(
        <tr>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img
                  src={item.image}
                  alt={item.name} />
              </div>
            </div>
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm opacity-75 text-yellow-500">Model: {item.model} </div>
            </div>
          </div>
        </td>
        <td>
          {item.description}
          <br />
          <span className="p-2 pl-0 opacity-55 text-yellow-500">{item.category.name}</span>
        </td>
        <td>${item.price}</td>
        <th>
          <button className="btn btn-ghost btn-xs">{item.qty}</button>
        </th>
      </tr>
      ))}
      
      
    </tbody>
  </table>
</div>
<div>
            <div className="card bg-slate-900">
              <div className="card-body">
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Subtotal  ({items.reduce((a, c) => a + c.qty, 0)}) : $
                      {itemsPrice}
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/shipping')}
                      className="btn btn-primary bg-yellow-500  w-full"
                    >
                      Proceed to Checkout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
