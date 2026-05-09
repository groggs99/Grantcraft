import Link from "next/link";

const workflow = [
  {
    title: "Profile your organisation",
    copy: "Capture your mission, reach, capacity, and funding history once.",
  },
  {
    title: "Shape project ideas",
    copy: "Turn rough ideas into structured briefs with funder-ready detail.",
  },
  {
    title: "Prepare stronger applications",
    copy: "Use clear evidence, realistic budgets, and Irish sector language.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Grant<span className="text-emerald-600">Craft</span>
          </Link>
          <Link
            href="/auth"
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-emerald-700">
              For Irish non-profit organisations
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              Build grant applications from a stronger organisation profile.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
              GrantCraft helps community groups, charities, and social enterprises turn
              their profile and project ideas into clearer, more credible funding
              material.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/org/new"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Create organisation profile
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-6 py-3 text-base font-semibold text-stone-700 transition-colors hover:bg-stone-100"
              >
                Continue work
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  Organisation profile
                </p>
                <p className="text-sm text-stone-500">
                  The foundation for matching and applications
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                72%
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {[
                ["Mission and purpose", "Complete"],
                ["Activities and beneficiaries", "Complete"],
                ["Grant experience", "Needs detail"],
                ["Project brief", "Ready to draft"],
              ].map(([label, status]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3"
                >
                  <span className="text-sm font-medium text-stone-800">{label}</span>
                  <span className="text-xs font-medium text-stone-500">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 md:grid-cols-3">
            {workflow.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-stone-200 p-5"
              >
                <h2 className="text-base font-semibold text-stone-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
