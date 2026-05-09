import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4">
      <main className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-5xl font-bold tracking-tight text-stone-900">
            Grant<span className="text-emerald-600">Craft</span>
          </h1>
          <p className="max-w-sm text-lg text-stone-500">
            AI-powered grant applications for Irish community groups
          </p>
        </div>
        <Link
          href="/org/new"
          className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
