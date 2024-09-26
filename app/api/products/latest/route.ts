import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Product from "../../../../models/ProductModel";
// Handle GET request to retrieve all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).limit(4).populate('category')
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}