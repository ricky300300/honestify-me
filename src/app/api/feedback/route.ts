import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, message, category } = body;

    if (!username || typeof username !== "string" || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Feedback message is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    await prisma.feedback.create({
      data: {
        userId: user.id,
        message: message.trim(),
        category: category && typeof category === "string" ? category.trim() || null : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
