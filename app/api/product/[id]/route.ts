import connectDB from "@/lib/db";
import { NextResponse } from 'next/server'
import Product from "@/models/ProductModel";
import { ObjectId } from "mongodb";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB()
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }
  
    const { onPromotion } = await req.json();
  
    try {
      const updatedOrder = await Product.findByIdAndUpdate(
        id,
        { onPromotion },
        { new: true }
      );
  
      if (!updatedOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }