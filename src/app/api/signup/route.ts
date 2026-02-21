import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (!username || typeof username !== "string" || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        username: username.trim(),
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Unique constraint") || message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "An account with this email or username already exists." },
        { status: 409 }
      );
    }
    if (
      message.includes("Connection terminated") ||
      message.includes("connection refused") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ENOTFOUND")
    ) {
      console.error("Signup DB connection error:", err);
      return NextResponse.json(
        {
          error:
            "Cannot reach the database. Check that it is running and DATABASE_URL is correct. For hosted Postgres (Neon, Supabase, etc.), add ?sslmode=require to the URL.",
        },
        { status: 503 }
      );
    }
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
