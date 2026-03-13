import { prisma } from "@/lib/prisma";

type TrackEventArgs = {
  eventName: string;
  username?: string;
  metadata?: any;
};

export async function trackEvent({ eventName, username, metadata }: TrackEventArgs) {
  try {
    await prisma.event.create({
      data: {
        eventName,
        username,
        metadata,
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("trackEvent error:", err);
    }
  }
}

