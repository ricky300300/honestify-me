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
      <div className="mt-6 flex flex-col gap-2 rounded-xl bg-green-500/15 px-3 py-3 text-sm text-green-700 dark:text-green-400">
        <p>Thanks! Your feedback was sent.</p>
        <p>
          Want honest feedback too?
          <br />
          <Link
            href="/signup"
            className="font-medium underline underline-offset-2 hover:no-underline"
          >
            Create your own private feedback page.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Your feedback</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="min-h-[120px] resize-y rounded-xl border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          placeholder="Write your anonymous feedback here…"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/80">Category (optional)</span>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          placeholder="e.g. Design, Content"
        />
      </label>

      {status === "error" && (
        <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-700 dark:text-red-400">
          {errorText}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 h-12 w-full rounded-2xl bg-foreground font-medium text-background transition-opacity hover:opacity-90 active:opacity-95 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
