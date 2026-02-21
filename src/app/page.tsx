import Link from "next/link";

export default function Home() {
  return (
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

          <Link
            href="/signup"
            className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-foreground text-base font-medium text-background transition-opacity hover:opacity-90 active:opacity-95"
          >
            Get started
          </Link>
        </div>
      </main>
    </div>
  );
}
