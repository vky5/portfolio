import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/content.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Basic Auth Check (In prod, use cookies/headers, here we trust the client sends this if they have access to the protected route)
    // For strictly secure apps, validate token from headers.
    // Since this is a simple personal portfolio as requested:

    const newEntry = await request.json();

    // Read existing
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const blogs = JSON.parse(fileContent);

    // Update if exists, else append
    const existingIndex = blogs.findIndex(
      (b: { id: string }) => b.id === newEntry.id,
    );
    if (existingIndex > -1) {
      blogs[existingIndex] = newEntry;
    } else {
      blogs.unshift(newEntry); // Add new to top
    }

    // Write back
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(blogs, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save" },
      { status: 500 },
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const updateData = await request.json();
    const { id } = updateData;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID" },
        { status: 400 },
      );
    }

    // Read existing
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const blogs = JSON.parse(fileContent);

    const index = blogs.findIndex((b: { id: string }) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    // Merge updates
    blogs[index] = { ...blogs[index], ...updateData };

    // Write back
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(blogs, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update" },
      { status: 500 },
    );
  }
}
