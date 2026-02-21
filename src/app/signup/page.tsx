"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

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
      setMessage({ type: "success", text: "Account created. Redirecting to sign in…" });
      setEmail("");
      setPassword("");
      setUsername("");
      setTimeout(() => router.push("/login"), 1000);
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center px-4 py-8">
        <Link
          href="/"
          className="mb-6 text-sm text-foreground/70 underline hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="w-full rounded-2xl border border-foreground/10 bg-background p-6">
          <h1 className="text-xl font-semibold tracking-tight">Create an account</h1>
          <p className="mt-1 text-sm text-foreground/70">Enter your details below to sign up.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="rounded-xl border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
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
                className="rounded-xl border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
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
                className="rounded-xl border border-foreground/20 bg-transparent px-3 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                placeholder="At least 8 characters"
              />
            </label>

            {message && (
              <p
                className={`rounded-xl px-3 py-2 text-sm ${
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
              className="mt-2 h-12 w-full rounded-2xl bg-foreground font-medium text-background transition-opacity hover:opacity-90 active:opacity-95 disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-foreground/70">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-foreground">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
