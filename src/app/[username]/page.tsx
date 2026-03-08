import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FeedbackForm from "./FeedbackForm";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
  });
  const displayName = user?.fullName?.trim() || user?.username || username;

  if (!user) {
    return {
      title: "User not found",
      description: "This feedback page could not be found.",
    };
  }

  return {
    title: `Send anonymous feedback to ${displayName}`,
    description: `Send private, anonymous feedback to ${displayName}. No signup required — share your honest thoughts safely.`,
    openGraph: {
      title: `Send anonymous feedback to ${displayName}`,
      description: `Send private, anonymous feedback to ${displayName}. No signup required.`,
    },
  };
}

export default async function FeedbackPage({ params }: Props) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
  });

  const feedbackCount = user
    ? await prisma.feedback.count({ where: { userId: user.id } })
    : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-[400px] flex-col justify-center px-4 py-8 sm:py-12">
          <div className="w-full rounded-2xl border border-foreground/10 bg-background p-6 text-center">
            <p className="text-foreground/90">User not found</p>
            <Link
              href="/"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center text-sm text-foreground/70 underline hover:text-foreground"
            >
              Back to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen w-full max-w-[400px] flex-col justify-center px-4 py-8 sm:py-10">
        <div className="w-full rounded-2xl border border-foreground/10 bg-background p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {user.fullName?.trim() || user.username}
          </h1>
          <p className="mt-1 text-sm text-foreground/70">Send anonymous feedback</p>
          <p className="mt-1 text-xs text-foreground/50">
            Messages are reviewed to prevent abusive or harmful content.
          </p>
          {feedbackCount > 0 && (
            <p className="mb-4 text-center">
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {feedbackCount === 1
                  ? "1 person has shared feedback so far."
                  : `${feedbackCount} people have shared feedback so far.`}
              </span>
            </p>
          )}
          <FeedbackForm username={user.username} />
        </div>
      </main>
    </div>
  );
}
