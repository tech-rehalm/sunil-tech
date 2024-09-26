import { auth } from '@/auth'
import connectDB from '@/lib/db'
import OrderModel from '@/models/OrderModel'

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await connectDB()
  const orders = await OrderModel.find()
    .sort({ createdAt: -1 })
    .populate('user', 'firstname')

  return Response.json(orders)
})
