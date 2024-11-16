import connectDB from '@/lib/db'
import OrderModel from '@/models/OrderModel'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import Order from "@/models/OrderModel";
import { ObjectId } from "mongodb";


export const GET = auth(async (...request) => {
  const [req, { params }] = request
  
  await connectDB()
  const order = await OrderModel.findById(params?.id)
  console.log(order);
  
  return NextResponse.json(order)
}) 


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB()
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  const { isDelivered } = await req.json();

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { isDelivered },
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