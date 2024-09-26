import { auth } from '@/auth'
import connectDB from '@/lib/db'
import {User} from '@/models/UserModel'

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
  const users = await User.find()
  return Response.json(users)
})
