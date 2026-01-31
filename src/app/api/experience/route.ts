import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Experience from "@/models/Experience";

export async function GET() {
  await dbConnect();
  try {
    const experiences = await Experience.find({}).sort({ period: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { _id, ...rest } = data;

    if (_id) {
      const updatedExperience = await Experience.findByIdAndUpdate(_id, rest, {
        new: true,
      });
      if (!updatedExperience) {
        return NextResponse.json(
          { success: false, message: "Experience not found" },
          { status: 404 },
        );
      }
    } else {
      await Experience.create(rest);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving experience:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
