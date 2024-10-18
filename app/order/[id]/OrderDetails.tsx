'use client'
import { useParams, useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { OrderItem } from '@/models/OrderModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {toast} from 'react-toastify'
import { useState, useEffect } from 'react'
import useSWRMutation from 'swr/mutation'

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
  const params = useParams();
  const router = useRouter();

  const fetchOrderData = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch order details')
      }
      const data = await res.json()
      setOrderData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(res.ok){
        fetchOrderData()
        toast.success('Order delivered successfully')
      }
      else{
        toast.error("Error updating the product")
      }
    }
  )

  const { data: session } = useSession()
  console.log(session)

  async function createPayPalOrder() {
    const response = await fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const order = await response.json()
    return order.id
  }

  const updateOrderStatus = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPaid: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  // State for managing the fetched order data any
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch order details using useEffect and fetch API
  useEffect(() => {
    fetchOrderData()
  }, [orderId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!orderData) return <div>No order data available</div>

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = orderData

  return (
    <div className='p-8'>
      <h1 className="text-2xl py-4 text-yellow-500">Order {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-slate-900">
            <div className="card-body">
              <h2 className="card-title text-yellow-500">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>

          <div className="card bg-slate-900 mt-4">
            <div className="card-body">
              <h2 className="card-title text-yellow-500">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">Paid at {paidAt}</div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>

          <div className="card bg-slate-900 mt-4">
            <div className="card-body">
              <h2 className="card-title text-yellow-500">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item._id}>
                      <td>
                        <Link
                          href={`/product/${item._id}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">
                            {item.name} ({item.model} {item.category.name})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-slate-900">
            <div className="card-body">
              <h2 className="card-title text-yellow-500">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>

                {!isPaid&& (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
          <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE", // Add the intent property
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'USD', // Ensure currency_code is provided
                        value: totalPrice.toString(),
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                if (actions.order) {
                  const details = await actions.order.capture();
                  if (details.status === 'COMPLETED') {
                    await updateOrderStatus();
                    router.refresh()
                  }
                }
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}
                {session?.user.isAdmin && (
                  <li>
                    <button
                      className="btn w-full bg-yellow-500 text-slate-900 my-2"
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Mark as delivered
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}