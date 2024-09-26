import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Category } from "@/models/CategoryModel";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    await connectDB();

    // Check for duplicate category name
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const category = new Category({ name });
    await category.save();

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// Fetch all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find();

    if (!categories.length) {
      return NextResponse.json({ message: "No categories found" }, { status: 200 });
    }

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


// Update a category
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ error: "Both category ID and name are required" }, { status: 400 });
    }

    await connectDB();
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


// Delete a category
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await connectDB();

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

