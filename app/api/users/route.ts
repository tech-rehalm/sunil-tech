import connectDB from "@/lib/db";
import { User } from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDB()
    try {
        const users = await User.find()
    return NextResponse.json(users, {status: 200})
    } catch (error) {
        return NextResponse.json(error)
    }
}