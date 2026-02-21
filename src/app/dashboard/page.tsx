"use client";

import { useCallback, useEffect, useState } from "react";

type FeedbackItem = {
  id: string;
  message: string;
  category: string | null;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchFeedback = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Not signed in");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setError("Session expired");
        setLoading(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setUsername(data.username ?? null);
      const all = data.feedback ?? [];
      setFeedback(all.filter((f: FeedbackItem) => f.status === "APPROVED"));
      setError(null);
    } catch {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const shareUrl =
    typeof window !== "undefined" && username
      ? `${window.location.origin}/${username}`
      : "";

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-[400px] px-4 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        {!loading && !error && username && (
          <div className="mt-6 rounded-xl border border-foreground/10 bg-background p-4">
            <p className="text-xs font-medium text-foreground/70">Share your feedback link</p>
            <p className="mt-1.5 break-all text-sm text-foreground/90" title={shareUrl}>
              {shareUrl}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 min-h-[44px] min-w-[44px] rounded-xl border border-foreground/30 px-4 py-2.5 text-sm font-medium hover:bg-foreground/10 active:opacity-90"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        )}

        {loading && (
          <p className="mt-6 text-sm text-foreground/70">Loading…</p>
        )}
        {error && (
          <p className="mt-6 rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && (
          <section className="mt-8">
            {feedback.length === 0 ? (
              <p className="text-sm text-foreground/60">No approved feedback yet.</p>
            ) : (
              <ul className="space-y-3">
                {feedback.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-foreground/10 bg-background p-4"
                  >
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {item.message}
                    </p>
                    {item.category && (
                      <p className="mt-1 text-xs text-foreground/60">{item.category}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
