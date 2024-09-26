import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Product from "../../../models/ProductModel";
// Handle GET request to retrieve all products
export async function GET() {
  try {
    await connectDB();
    const product = await Product.findOne({onPromotion: true}).populate('category');
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}