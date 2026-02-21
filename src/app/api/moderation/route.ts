import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

function getUserIdFromRequest(request: Request): string | null {
  const auth = request.headers.get("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const payload = jwt.verify(token, secret) as { userId: string };
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Approve/reject is admin-only: caller must match ADMIN_EMAIL
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return NextResponse.json({ error: "Admin not configured." }, { status: 503 });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email.toLowerCase() !== adminEmail) {
    return NextResponse.json(
      { error: "Only admin can approve or reject feedback." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { feedbackId, action } = body;

    if (!feedbackId || typeof feedbackId !== "string") {
      return NextResponse.json(
        { error: "feedbackId is required." },
        { status: 400 }
      );
    }
    if (action !== "APPROVED" && action !== "REJECTED") {
      return NextResponse.json(
        { error: "action must be APPROVED or REJECTED." },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
    }

    await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status: action },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Moderation API error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
