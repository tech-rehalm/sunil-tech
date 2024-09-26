import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // Your MongoDB connection utility
import Order from "@/models/OrderModel"; // Your Order model
import { ObjectId } from "mongodb";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await connectDB()
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  const { isPaid } = await req.json();

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { isPaid },
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
