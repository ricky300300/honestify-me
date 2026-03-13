import { prisma } from "@/lib/prisma";

type TrackEventArgs = {
  eventName: string;
  username?: string;
  metadata?: any;
};

export function isProbablyBot(userAgent?: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  const botIndicators = [
    "bot",
    "spider",
    "crawl",
    "slurp",
    "bingpreview",
    "facebookexternalhit",
    "monitor",
    "pingdom",
    "uptimerobot",
    "headless",
    "lighthouse",
    "pagespeed",
    "ahrefs",
    "semrush",
  ];
  return botIndicators.some((indicator) => ua.includes(indicator));
}

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

