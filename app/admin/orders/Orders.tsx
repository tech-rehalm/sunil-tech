'use client'
import { Order } from '@/models/OrderModel'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch orders when the component mounts
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
        console.log(err);
        
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Handle different states: loading, error, and displaying data
  if (loading) return <div>Loading...</div>
  if (!orders || orders.length === 0) return <div>No orders found.</div>

  return (
    <div>
      <h1 className="py-4 text-2xl">Orders</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                <td>..{order._id.substring(20, 24)}</td>
                <td>{order.user?.firstname || 'Deleted user'}</td>
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
    </div>
  )
}
