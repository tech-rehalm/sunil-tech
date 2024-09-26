import { auth } from '@/auth'
import connectDB from '@/lib/db'
import OrderModel from '@/models/OrderModel'
import { paypal } from '@/lib/paypal'

export const POST = auth(async (...request) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await connectDB()

  const order = await OrderModel.findById(params?.id)
  if (order) {
    try {
      const paypalOrder = await paypal.createOrder(order.totalPrice)
      return Response.json(paypalOrder)
    } catch (err) {
      return Response.json(
        { message: err },
        {
          status: 500,
        }
      )
    }
  } else {
    return Response.json(
      { message: 'Order not found' },
      {
        status: 404,
      }
    )
  }
})