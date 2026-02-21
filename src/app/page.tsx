import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-12 sm:px-8">
        <div className="flex w-full flex-col items-center text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl sm:leading-tight">
            Get honest, professional feedback — safely.
          </h1>

          <ul className="mt-10 flex w-full max-w-sm list-none flex-col gap-4 text-left">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-hidden />
              <span className="text-foreground/90">
                Share work anonymously so reviewers focus on the work, not who made it.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-hidden />
              <span className="text-foreground/90">
                Get structured, actionable feedback you can use to improve.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-foreground" aria-hidden />
              <span className="text-foreground/90">
                Control who sees what — your privacy and safety come first.
              </span>
            </li>
          </ul>

          <Link
            href="/signup"
            className="mt-10 inline-flex h-12 min-w-[180px] items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-opacity hover:opacity-90 active:opacity-95"
          >
            Get started
          </Link>
        </div>
      </main>
    </div>
  );
}
