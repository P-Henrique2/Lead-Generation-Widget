type LeadDetailPageProps = {
  params: { id: string };
};

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Lead Detail</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Lead {params.id}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
        This screen will render the full details for a selected lead.
      </p>
    </section>
  );
}
