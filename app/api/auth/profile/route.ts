import { auth } from '@/auth'
import connectDB from '@/lib/db'
import {User} from '@/models/UserModel'
import bcrypt from 'bcryptjs'

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }
  const { user } = req.auth
  const { firstname, lastname, email, password } = await req.json()
  await connectDB()
  try {
    const dbUser = await User.findById(user._id)
    if (!dbUser) {
      return Response.json(
        { message: 'User not found' },
        {
          status: 404,
        }
      )
    }
    dbUser.firstname = firstname
    dbUser.lastname = lastname
    dbUser.email = email
    dbUser.password = password
      ? await bcrypt.hash(password, 5)
      : dbUser.password
    await dbUser.save()
    return Response.json({ message: 'User has been updated' })
  } catch (err) {
    return Response.json(
      { message: err },
      {
        status: 500,
      }
    )
  }
})
