import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";

export async function GET() {
  await dbConnect();
  try {
    const projects = await Project.find({}).sort({ year: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = await request.json();
    const { _id, ...rest } = data;

    if (_id) {
      const updatedProject = await Project.findByIdAndUpdate(_id, rest, {
        new: true,
      });
      if (!updatedProject) {
        return NextResponse.json(
          { success: false, message: "Project not found" },
          { status: 404 },
        );
      }
    } else {
      await Project.create(rest);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
