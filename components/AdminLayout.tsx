"use client"

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  ClipboardList, 
  Tags, 
  PlusCircle, 
  Settings,
  Menu,
  X
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = [
    { title: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "Customers", href: "/admin/customers", icon: <Users className="w-5 h-5" /> },
    { title: "All Products", href: "/admin/products", icon: <ShoppingBag className="w-5 h-5" /> },
    { title: "All Orders", href: "/admin/orders", icon: <ClipboardList className="w-5 h-5" /> },
    { title: "Categories", href: "/admin/categories", icon: <Tags className="w-5 h-5" /> },
    { title: "Add Product", href: "/admin/addProduct", icon: <PlusCircle className="w-5 h-5" /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" checked={isMobileMenuOpen} onChange={toggleMobileMenu} />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300 lg:hidden">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <Menu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
        </div>
        {/* Page content */}
        <div className="p-4 lg:ml-64">
          {children}
        </div>
      </div> 
      <div className="drawer-side z-40">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label> 
        <aside className="w-64 bg-base-200 text-base-content h-full">
          <div className="p-4 flex justify-between items-center lg:hidden">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={toggleMobileMenu} className="btn btn-square btn-ghost">
              <X className="w-6 h-6" />
            </button>
          </div>
          <ul className="menu p-4 w-full">
            {links.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={`flex items-center p-2 rounded-lg ${
                    pathname === link.href 
                      ? "bg-warning text-warning-content" 
                      : "hover:bg-base-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span className="ml-3">{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}