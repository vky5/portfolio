import { NextResponse } from "next/server";
import crypto from "crypto";

const TARGET_HASH =
  "0544f66a0077e4b1b0fa556269beb76c34211aac31d4716e4936b3d8c5f6dfd6";
const TARGET_USER = "vky5admin";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username !== TARGET_USER) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Server-side hashing
    const hash = crypto.createHash("sha256").update(password).digest("hex");

    if (hash === TARGET_HASH) {
      // Generate a simple session token
      const token = crypto.randomUUID();

      // LOGGING THE SESSION TOKEN as requested
      console.log("------------------------------------------");
      console.log("🔐 ADMIN AUTHENTICATION SUCCESS");
      console.log("Issued Session Token:", token);
      console.log("User:", username);
      console.log("Timestamp:", new Date().toISOString());
      console.log("------------------------------------------");

      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
