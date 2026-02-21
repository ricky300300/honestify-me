"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type FeedbackItem = {
  id: string;
  message: string;
  category: string | null;
  status: string;
  createdAt: string;
  username: string;
};

export default function AdminDashboardPage() {
  const [pending, setPending] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Not signed in");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending-feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setError("Session expired");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setPending(data.feedback ?? []);
      setError(null);
    } catch {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  async function handleModerate(feedbackId: string, action: "APPROVED" | "REJECTED") {
    const token = localStorage.getItem("token");
    if (!token) return;
    setActingId(feedbackId);
    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedbackId, action }),
      });
      if (res.ok) await fetchPending();
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto w-full max-w-[400px] px-4 py-6 sm:py-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex min-h-[44px] items-center text-sm text-foreground/70 underline hover:text-foreground"
        >
          ← Dashboard
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="mt-1 text-sm text-foreground/70">Moderate feedback.</p>

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
            <h2 className="text-lg font-medium text-foreground">Pending</h2>
            {pending.length === 0 ? (
              <p className="mt-2 text-sm text-foreground/60">No pending feedback.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {pending.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-foreground/10 bg-background p-4"
                  >
                    <p className="text-xs text-foreground/60">@{item.username}</p>
                    <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">
                      {item.message}
                    </p>
                    {item.category && (
                      <p className="mt-1 text-xs text-foreground/60">{item.category}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleModerate(item.id, "APPROVED")}
                        disabled={actingId === item.id}
                        className="min-h-[44px] min-w-[44px] rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60 active:opacity-90"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerate(item.id, "REJECTED")}
                        disabled={actingId === item.id}
                        className="min-h-[44px] min-w-[44px] rounded-xl border border-foreground/30 px-4 py-2.5 text-sm font-medium disabled:opacity-60 active:opacity-90"
                      >
                        Reject
                      </button>
                    </div>
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
