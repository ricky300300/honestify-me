"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { username: string };

export default function FeedbackForm({ username }: Props) {
  const router = useRouter();
  const [doWell, setDoWell] = useState("");
  const [improve, setImprove] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function buildMessage(): string {
    const parts: string[] = [];
    if (doWell.trim()) parts.push(`What they do well:\n${doWell.trim()}`);
    if (improve.trim()) parts.push(`One thing to improve:\n${improve.trim()}`);
    if (suggestion.trim()) parts.push(`Suggestion:\n${suggestion.trim()}`);
    return parts.join("\n\n");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorText("");
    const message = buildMessage();
    if (!message.trim()) {
      setErrorText("Please add at least one response.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorText(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setDoWell("");
      setImprove("");
      setSuggestion("");
      router.refresh();
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
      <p className="text-sm text-foreground/60 dark:text-foreground/50">
        Share something constructive:
        <br />
        <span className="mt-1 inline-block">• A strength</span>
        <br />
        <span className="inline-block">• Something they could improve</span>
        <br />
        <span className="inline-block">• A suggestion</span>
      </p>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/90">What does this person do well? (optional)</span>
        <textarea
          value={doWell}
          onChange={(e) => setDoWell(e.target.value)}
          rows={3}
          className="min-h-[80px] resize-y rounded-xl border border-foreground/20 bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          placeholder="A strength"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/90">What is one thing they could improve? (optional)</span>
        <textarea
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
          rows={3}
          className="min-h-[80px] resize-y rounded-xl border border-foreground/20 bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          placeholder="Something they could improve"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground/90">Any suggestion for them? (optional)</span>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          rows={3}
          className="min-h-[80px] resize-y rounded-xl border border-foreground/20 bg-transparent px-4 py-3.5 text-base text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          placeholder="A suggestion"
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
        <p className="mt-2 text-center text-sm text-gray-400 dark:text-gray-500">Your identity is never shown to the recipient.</p>
      </div>
    </form>
  );
}
