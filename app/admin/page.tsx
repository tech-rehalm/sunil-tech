"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Category, Order, Product, User } from '@/types/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Package, ShoppingCart, Users, Layers, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      if (!res.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data.categories as Category[])
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    }
  }
    
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products as Product[])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products")
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      if (!res.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error("Error fetching orders:", err)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders(), fetchCategories(), fetchUsers()])
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-warning"></span>
    </div>
  )

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const averageOrderValue = totalRevenue / orders.length || 0

  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order._id,
    customer: order.user?.firstname || 'Guest',
    total: order.totalPrice,
    status: order.isPaid ? 'Paid' : 'Pending'
  }))

  const salesData = orders.slice(0, 7).map(order => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    amount: order.totalPrice
  }))

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className="text-3xl font-bold text-warning mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-slate-900 shadow">
          <div className="stat-figure text-warning">
            <Package size={36} />
          </div>
          <div className="stat-title">Total Products</div>
          <div className="stat-value text-warning">{products?.length}</div>
        </div>
        <div className="stat bg-slate-900 shadow">
          <div className="stat-figure text-warning">
            <ShoppingCart size={36} />
          </div>
          <div className="stat-title">Total Orders</div>
          <div className="stat-value text-warning">{orders?.length}</div>
        </div>
        <div className="stat bg-slate-900 shadow">
          <div className="stat-figure text-warning">
            <Users size={36} />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-warning">{users?.length}</div>
        </div>
        <div className="stat bg-slate-900 shadow">
          <div className="stat-figure text-warning">
            <Layers size={36} />
          </div>
          <div className="stat-title">Categories</div>
          <div className="stat-value text-warning">{categories?.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card bg-slate-900 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-warning mb-4">Sales Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#FFB300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-slate-900 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-warning mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id.slice(0, 8)}...</td>
                      <td>{order.customer}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <div className={`badge ${order.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                          {order.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-slate-900 shadow">
          <div className="stat-figure text-warning">
            <DollarSign size={36} />
          </div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-warning">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat bg-slate-900 shadow">
          <div className="stat-figure text-warning">
            <ShoppingCart size={36} />
          </div>
          <div className="stat-title">Average Order Value</div>
          <div className="stat-value text-warning">${averageOrderValue.toFixed(2)}</div>
        </div>
        <div className="stat bg-slate-900 shadow">
          <div className="stat-figure text-warning">
            <Package size={36} />
          </div>
          <div className="stat-title">Low Stock Items</div>
          <div className="stat-value text-warning">{products.filter(p => p.countInStock < 10).length}</div>
        </div>
      </div>

      <div className="card bg-slate-900 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-warning mb-4">Sunil Tech</h2>
          <h3 className="text-lg font-semibold mb-2">Code of Conduct and Privacy Policy</h3>
          <p className="text-sm text-base-content mb-4">
            Sunil Tech Store stands to provide technology devices and accessories, ensuring delivery of high-quality and affordable products. We aim not only to gain profit but also to promote the tech industry in making people's lives easier. We strictly provide original branded products from manufacturers. Any unfair practice or service is handled by management to ensure the organization meets all legal standards.
          </p>
          <p className="text-sm font-semibold text-base-content">&copy; SunilTech All Rights Reserved</p>
        </div>
      </div>
    </div>
  )
}