import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import {User} from '@/models/UserModel'

export const POST = async (request: NextRequest) => {
  const { firstname,lastname,  email, password } = await request.json()
  await connectDB()
  const hashedPassword = await bcrypt.hash(password, 5)
  const newUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  })
  try {
    await newUser.save()
    return Response.json(
      { message: 'User has been created' },
      {
        status: 201,
      }
    )
  } catch (err) {
    return Response.json(
      { message: err },
      {
        status: 500,
      }
    )
  }
}
