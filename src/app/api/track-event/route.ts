import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";

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

    await trackEvent({ eventName, username, metadata });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("track-event API error:", err);
    }
    // Do not break UX; return OK even if analytics fails.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

