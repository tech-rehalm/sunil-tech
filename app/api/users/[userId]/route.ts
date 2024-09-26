import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Assume you have a MongoDB connection utility
import {User} from '@/models/UserModel'; // Import your User model
import { ObjectId } from 'mongodb';


export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  await connectDB()
  // Validate if the provided ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // Try to find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return success message if the user is deleted
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
