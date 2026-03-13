import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isProbablyBot, trackEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, message, category } = body;

    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 },
      );
    }
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Feedback message is required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await prisma.feedback.create({
      data: {
        userId: user.id,
        message: message.trim(),
        category:
          category && typeof category === "string"
            ? category.trim() || null
            : null,
        status: "APPROVED",
      },
    });

    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined;

    if (!isProbablyBot(userAgent)) {
      await trackEvent({
        eventName: "feedback_submitted",
        username: user.username,
        metadata: {
          userAgent,
          ip,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
