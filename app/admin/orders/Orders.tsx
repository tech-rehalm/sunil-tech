'use client'

import { Order } from '@/models/OrderModel'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Eye, DollarSign, Truck, Calendar, User, ShoppingBag } from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders')
        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="alert alert-warning">
        <ShoppingBag className="w-6 h-6" />
        <span>No orders found.</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-warning">Orders</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order) => (
                  <tr key={order._id}>
                    <td>..{order._id.substring(20, 24)}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-warning" />
                        <span>{order.user?.firstname || 'Deleted user'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-warning" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-warning" />
                        <span>${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      {order.isPaid && order.paidAt ? (
                        <div className="badge badge-success gap-2">
                          <DollarSign className="w-4 h-4" />
                          {new Date(order.paidAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="badge badge-error gap-2">
                          <DollarSign className="w-4 h-4" />
                          Not paid
                        </div>
                      )}
                    </td>
                    <td>
                      {order.isDelivered && order.deliveredAt ? (
                        <div className="badge badge-success gap-2">
                          <Truck className="w-4 h-4" />
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="badge badge-error gap-2">
                          <Truck className="w-4 h-4" />
                          Not delivered
                        </div>
                      )}
                    </td>
                    <td>
                      <Link href={`/order/${order._id}`} passHref>
                        <button className="btn btn-warning btn-sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}