import { NextResponse } from "next/server";
import { isProbablyBot, trackEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { eventName, username, metadata } = (body || {}) as {
      eventName?: string;
      username?: string;
      metadata?: any;
    };

    if (!eventName || typeof eventName !== "string") {
      return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined;

    if (isProbablyBot(userAgent)) {
      // Ignore obvious bots
      return NextResponse.json({ ok: true });
    }

    await trackEvent({
      eventName,
      username,
      metadata: {
        ...(metadata ?? {}),
        userAgent,
        ip,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("track-event API error:", err);
    }
    // Do not break UX; return OK even if analytics fails.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

