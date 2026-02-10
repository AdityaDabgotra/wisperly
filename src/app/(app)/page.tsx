import Link from "next/link";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-slate-50 to-white">
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-14 flex flex-col md:flex-row items-center gap-12">
        {/* Hero copy */}
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Welcome to Wisperly
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            Anonymous messages,
            <span className="block text-sky-600">honest conversations.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-xl">
            Share your unique link, receive anonymous feedback, and understand what
            people really think — all in a safe, elegant dashboard built just for you.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="px-6 py-2">
              <Link href="/signUp">Get started for free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-6 py-2 border-slate-300"
            >
              <Link href="/signIn">Sign in</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div>
              <span className="font-semibold text-slate-900">Private</span> · Your
              identity is always protected.
            </div>
            <div>
              <span className="font-semibold text-slate-900">In control</span> ·
              Toggle message acceptance anytime.
            </div>
          </div>
        </div>

        {/* Hero card / preview */}
        <div className="flex-1 w-full">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Dashboard preview
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Your Wisperly space
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Accepting messages
              </span>
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-medium text-slate-800 mb-1">
                wisperly.com/u/your-username
              </p>
              <p>Share this link to receive anonymous messages from anyone.</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-slate-500">
                Recent whispers
              </p>
              <div className="space-y-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  “I really like how you explain complex topics in class.”
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  “You&apos;re a great teammate, keep doing what you do!”
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  “It would be awesome if we had more Q&amp;A sessions.”
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

