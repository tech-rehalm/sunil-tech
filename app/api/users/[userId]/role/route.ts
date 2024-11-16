import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Helper to connect to your DB
import {User} from '@/models/UserModel'; // Assuming you have a User model
import { ObjectId } from 'mongodb';

// Connect to DB (You may already have a utility file for this)


export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  await connectDB();
  // Validate the userId
  if (!ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // Parse the request body to get the new role
    const body = await req.json();
    const { isAdmin } = body;

    if (typeof isAdmin !== 'boolean') {
      return NextResponse.json({ error: 'Invalid role format' }, { status: 400 });
    }

    // Find the user by ID and update the role
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true } // Return the updated document
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Respond with the updated user data
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
