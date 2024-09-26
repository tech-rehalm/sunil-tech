"use client"

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function AdminLayout() {
    const pathname = usePathname()
    const links = [
        {
            title: "Dashboard",
            href: "/admin"
        },
        {
            title: "Customers",
            href: "/admin/customers"
        },{
            title: "All Products",
            href: "/admin/products"
        },{
            title: "All Orders",
            href: "/admin/orders"
        },{
            title: "Categories",
            href: "/admin/categories"
        },{
            title: "Add Product",
            href: "/admin/addProduct"
        },{
            title: "Settings",
            href: "/admin/settings"
        },
    ]
  return (
    <div className='w-[200px] mt-[60px] p-6 bg-slate-900 fixed left-0 top-0 pr-0 bottom-0'>
      <div className="pt-5 flex flex-col">
        {links.map((link)=>(
            <Link key={link.href} className={`p-3 my-1 transition duration-500   rounded-l-xl pr-0 text-yellow-500 hover:bg-slate-800 text-lg ${pathname === link.href && "border-yellow-500 border bg-slate-800 border-r-0 font-bold"}`} href={link.href}>{link.title}</Link>
        ))}
      </div>
    </div>
  )
}
