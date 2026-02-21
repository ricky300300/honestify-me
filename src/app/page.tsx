import Link from "next/link";
import RedirectIfLoggedIn from "./RedirectIfLoggedIn";

export default function Home() {
  return (
    <RedirectIfLoggedIn>
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-[400px] flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl border border-foreground/10 bg-background p-6 text-center">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">
            Get honest, professional feedback — safely.
          </h1>

          <ul className="mt-8 flex w-full list-none flex-col gap-3 text-left">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-hidden />
              <span className="text-sm text-foreground/90">
                Share work anonymously so reviewers focus on the work, not who made it.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-hidden />
              <span className="text-sm text-foreground/90">
                Get structured, actionable feedback you can use to improve.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-hidden />
              <span className="text-sm text-foreground/90">
                Control who sees what — your privacy and safety come first.
              </span>
            </li>
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/signup"
              className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90 active:opacity-95"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-foreground/30 text-base font-medium transition-opacity hover:bg-foreground/10 active:opacity-95"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
    </RedirectIfLoggedIn>
  );
}
