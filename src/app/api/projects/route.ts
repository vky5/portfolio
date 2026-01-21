import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/projects.json");

async function ensureFile() {
  try {
    await fs.access(DATA_FILE_PATH);
  } catch {
    await fs.writeFile(DATA_FILE_PATH, "[]", "utf-8");
  }
}

export async function GET() {
  await ensureFile();
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureFile();
  try {
    const newEntry = await request.json();
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const projects = JSON.parse(fileContent);

    // If ID exists, update
    if (newEntry.id) {
      const index = projects.findIndex(
        (p: { id: string }) => p.id === newEntry.id,
      );
      if (index > -1) {
        projects[index] = newEntry;
      } else {
        // Generate new ID
        projects.unshift({ ...newEntry, id: Date.now().toString() });
      }
    } else {
      // Create new
      projects.unshift({ ...newEntry, id: Date.now().toString() });
    }

    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(projects, null, 2),
      "utf-8",
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    let projects = JSON.parse(fileContent);
    projects = projects.filter((p: { id: string }) => p.id !== id);

    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(projects, null, 2),
      "utf-8",
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
