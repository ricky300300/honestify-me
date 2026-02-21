"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Signup failed. Please try again." });
        return;
      }
      setMessage({ type: "success", text: "Account created. You can sign in now." });
      setEmail("");
      setPassword("");
      setUsername("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
        <Link
          href="/"
          className="mb-8 text-sm text-foreground/70 underline hover:text-foreground"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Enter your details below to sign up.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              placeholder="johndoe"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={8}
              className="rounded-lg border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              placeholder="At least 8 characters"
            />
          </label>

          {message && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                message.type === "error"
                  ? "bg-red-500/15 text-red-700 dark:text-red-400"
                  : "bg-green-500/15 text-green-700 dark:text-green-400"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-12 rounded-lg bg-foreground font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Sign up"}
          </button>
        </form>
      </main>
    </div>
  );
}
