import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const MESSAGES_FILE = path.join(process.cwd(), "src/data/messages.json");

// Ensure file exists helper
async function ensureFile() {
  try {
    await fs.access(MESSAGES_FILE);
  } catch {
    await fs.writeFile(MESSAGES_FILE, "[]", "utf-8");
  }
}

export async function GET() {
  await ensureFile();
  try {
    const data = await fs.readFile(MESSAGES_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to read messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  await ensureFile();
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      date: new Date().toISOString(),
    };

    const fileContent = await fs.readFile(MESSAGES_FILE, "utf-8");
    const messages = JSON.parse(fileContent);
    messages.unshift(newMessage); // Add to top

    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  await ensureFile();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const fileContent = await fs.readFile(MESSAGES_FILE, "utf-8");
    let messages = JSON.parse(fileContent);

    // Filter out the message to delete
    messages = messages.filter((msg: { id: string }) => msg.id !== id);

    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
