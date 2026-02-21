import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FeedbackForm from "./FeedbackForm";

type Props = { params: Promise<{ username: string }> };

export default async function FeedbackPage({ params }: Props) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center px-4 py-12">
          <div className="w-full rounded-2xl border border-foreground/10 bg-background p-6 text-center">
            <p className="text-foreground/90">User not found</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-foreground/70 underline hover:text-foreground"
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
      <main className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center px-4 py-8">
        <div className="w-full rounded-2xl border border-foreground/10 bg-background p-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            {user.fullName?.trim() || user.username}
          </h1>
          <p className="mt-1 text-sm text-foreground/70">Send anonymous feedback</p>
          <FeedbackForm username={user.username} />
        </div>
      </main>
    </div>
  );
}
