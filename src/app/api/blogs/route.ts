import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET() {
  await dbConnect();
  try {
    const blogs = await Blog.find({}).sort({ date: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { id } = data; // Using 'id' for slug

    const existingBlog = await Blog.findOne({ id });
    if (existingBlog) {
      await Blog.findOneAndUpdate({ id }, data, { new: true });
    } else {
      await Blog.create(data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving blog:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const updateData = await request.json();
    const { id } = updateData;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID" },
        { status: 400 },
      );
    }

    const updatedBlog = await Blog.findOneAndUpdate({ id }, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await Blog.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
