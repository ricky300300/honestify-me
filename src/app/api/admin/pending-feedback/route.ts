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

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return NextResponse.json(
      { error: "Admin not configured." },
      { status: 503 },
    );
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email.toLowerCase() !== adminEmail) {
    return NextResponse.json(
      { error: "Forbidden. Admin only." },
      { status: 403 },
    );
  }

  try {
    const pending = await prisma.feedback.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        category: true,
        status: true,
        createdAt: true,
        user: { select: { username: true } },
      },
    });
    return NextResponse.json({
      feedback: pending.map((f) => ({
        id: f.id,
        message: f.message,
        category: f.category,
        status: f.status,
        createdAt: f.createdAt,
        username: f.user.username,
      })),
    });
  } catch (err) {
    console.error("Admin pending feedback error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
