import { getLeadCount } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function HealthPage() {
  const leadCount = await getLeadCount();

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Health</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Health check</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
        The live lead count is being read from Firestore through the server-only admin client.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-sm text-slate-400">Total leads</p>
        <p className="mt-2 text-3xl font-semibold text-cyan-400">{leadCount}</p>
      </div>
    </section>
  );
}
