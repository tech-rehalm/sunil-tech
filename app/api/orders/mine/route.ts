import connectDB from '@/lib/db'
import OrderModel from '@/models/OrderModel'
import { auth } from '@/auth'

export const GET = auth(async (req) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  const { user } = req.auth
  await connectDB()
  const orders = await OrderModel.find({ user: user._id })
  return Response.json(orders)
})
