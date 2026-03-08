"use client";

import Link from "next/link";
import { useState } from "react";

type Props = { username: string };

export default function FeedbackForm({ username }: Props) {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorText("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          message,
          category: category.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorText(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage("");
      setCategory("");
    } catch {
      setStatus("error");
      setErrorText("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="mt-8 flex flex-col space-y-4 rounded-xl bg-green-500/15 p-6 text-center text-sm text-green-700 dark:text-green-400 sm:mt-10">
        <p className="font-semibold">Thanks! Your feedback was sent.</p>
        <p>Curious what people honestly think about you?</p>
        <p className="opacity-90">
          Many people discover surprising things when they ask for anonymous feedback.
        </p>
        <Link
          href="/signup"
          className="w-full rounded-xl bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600 active:opacity-95 sm:w-auto sm:min-w-[200px]"
        >
          Create my feedback page
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 sm:mt-10">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/90">Your feedback</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="min-h-[120px] resize-y rounded-xl border border-foreground/20 bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          placeholder="Share constructive feedback. What's working well? What could be improved?"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/80">Category (optional)</span>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-h-[48px] rounded-xl border border-foreground/20 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          placeholder="e.g. Design, Content"
        />
      </label>

      {status === "error" && (
        <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {errorText}
        </p>
      )}

      <div className="mt-1 flex flex-col gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="min-h-[48px] w-full rounded-xl bg-foreground px-4 py-3 text-base font-medium text-background transition-opacity hover:opacity-90 active:opacity-95 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send Constructive Feedback"}
        </button>
        <p className="text-center text-xs text-foreground/50">Your identity is not shared.</p>
      </div>
    </form>
  );
}
