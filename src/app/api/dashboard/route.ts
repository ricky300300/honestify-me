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

export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const feedback = await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, message: true, category: true, status: true, createdAt: true },
    });
    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
