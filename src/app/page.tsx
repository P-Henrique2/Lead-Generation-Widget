import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl sm:p-8 lg:p-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Home</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Welcome to the widget lead experience</h1>
        <p className="text-base leading-7 text-slate-300 sm:text-lg">
          This starter app lays out the main routes for a lead capture widget, its dashboard, and settings controls.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/widget" className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950">
            Open widget
          </Link>
          <Link href="/health" className="rounded-full border border-slate-700 px-5 py-3 font-medium text-slate-200">
            Check health
          </Link>
          <Link href="/playground/modal" className="rounded-full border border-cyan-500/40 px-5 py-3 font-medium text-cyan-300">
            Test modal
          </Link>
        </div>
      </div>
    </section>
  );
}
