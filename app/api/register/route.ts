import { User } from "@/models/UserModel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // For hashing the password

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { firstname, lastname, email, password } = await req.json();

    // Connect to the database
    await connectDB();

    // Check if all required fields are provided
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword, // Save the hashed password
    });

    // Save the new user to the database
    await user.save();

    // Return the user details (excluding the password)
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create a user" },
      { status: 500 }
    );
  }
}
