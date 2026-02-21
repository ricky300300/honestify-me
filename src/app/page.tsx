import Link from "next/link";
import RedirectIfLoggedIn from "./RedirectIfLoggedIn";

export default function Home() {
  return (
    <RedirectIfLoggedIn>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <main className="mx-auto w-full max-w-2xl px-4 py-16">
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
              Honest feedback. Constructively delivered.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Create a private feedback page. Receive anonymous responses —
              filtered to prevent abusive or harmful messages..
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/signup"
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 active:opacity-95 dark:bg-white dark:text-gray-900 sm:w-auto"
              >
                Create Your Feedback Page
              </Link>
              <Link
                href="/login"
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 transition-opacity hover:bg-gray-50 active:opacity-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 sm:w-auto"
              >
                Login
              </Link>
            </div>
          </section>

          {/* Divider */}
          <hr className="mx-auto mt-16 w-12 border-gray-300 dark:border-gray-700" />

          {/* Benefits */}
          <section className="mt-16">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Anonymous
                </p>
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  Senders stay anonymous so feedback focuses on the work, not
                  the person.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  One link
                </p>
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  Share a single link. Anyone can submit feedback without
                  creating an account.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  AI Moderated
                </p>
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  AI helps prevent abusive or harmful messages so feedback stays
                  professional and useful.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </RedirectIfLoggedIn>
  );
}
