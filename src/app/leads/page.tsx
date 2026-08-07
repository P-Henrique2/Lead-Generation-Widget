import Link from "next/link";

export default function LeadsPage() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl sm:p-8">
      <div className="max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Leads</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Leads dashboard</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            There are no leads yet because the capture workflow hasn’t collected any qualified prospects.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-200 shadow-sm">
          <p className="text-lg font-semibold text-white">Try the qualification widget</p>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Start a chat in the widget to qualify leads and save the best prospects to your dashboard.
          </p>
          <Link
            href="/widget"
            className="mt-4 inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Open the qualification chat
          </Link>
        </div>
      </div>
    </section>
  );
}
