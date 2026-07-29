import { WidgetChat } from "@/components/widget-chat";

export default function WidgetPage() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl sm:p-8">
      <div className="mb-6 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Widget</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Lead capture widget</h1>
        <p className="mt-3 text-base leading-7 text-slate-300">
          This screen now hosts a conversational widget experience that streams responses from the existing chat route.
        </p>
      </div>

      <WidgetChat />
    </section>
  );
}
