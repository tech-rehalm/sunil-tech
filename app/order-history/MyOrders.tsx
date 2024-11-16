'use client'

import { Order } from '@/models/OrderModel'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MyOrders() {

  // State management for orders, loading, and error
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders/mine')
        if (!res.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Render loading, error, or the orders table based on state
  if (loading) return <div>Loading...</div>
  if (error) return <div>An error has occurred: {error}</div>
  if (!orders || orders.length === 0) return <div>No orders found.</div>

  return (
    <div className="overflow-x-auto p-10">
      <table className="table">
        <thead className='text-yellow-500 opacity-100'>
          <tr>
            <th>ID</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order._id}>
              <td>{order._id.substring(20, 24)}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid && order.paidAt
                  ? `${order.paidAt.substring(0, 10)}`
                  : 'Not paid'}
              </td>
              <td>
                {order.isDelivered && order.deliveredAt
                  ? `${order.deliveredAt.substring(0, 10)}`
                  : 'Not delivered'}
              </td>
              <td>
                <Link href={`/order/${order._id}`} passHref>
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
