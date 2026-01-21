import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data/experience.json");

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
    const data = JSON.parse(fileContent);

    // If ID exists, update
    if (newEntry.id) {
      const index = data.findIndex((p: { id: string }) => p.id === newEntry.id);
      if (index > -1) {
        data[index] = newEntry;
      } else {
        data.unshift({ ...newEntry, id: Date.now().toString() });
      }
    } else {
      // Create new
      data.unshift({ ...newEntry, id: Date.now().toString() });
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
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
    let data = JSON.parse(fileContent);
    data = data.filter((p: { id: string }) => p.id !== id);

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
