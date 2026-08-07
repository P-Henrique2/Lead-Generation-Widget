type ScoreCardProps = {
  score: number;
  tier: "hot" | "warm" | "cold";
  reasoning: string;
};

export function ScoreCard({ score, tier, reasoning }: ScoreCardProps) {
  const tierStyles = {
    hot: {
      badge: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
      panel: "border-cyan-400/30 bg-cyan-400/10",
      label: "HOT",
    },
    warm: {
      badge: "border-amber-400/40 bg-amber-400/10 text-amber-200",
      panel: "border-amber-400/30 bg-amber-400/10",
      label: "WARM",
    },
    cold: {
      badge: "border-slate-400/40 bg-slate-400/10 text-slate-200",
      panel: "border-slate-400/30 bg-slate-400/10",
      label: "COLD",
    },
  } as const;

  const selectedTier = tierStyles[tier];

  return (
    <div className={`rounded-2xl border p-3 ${selectedTier.panel}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Lead fit score</p>
          <p className="mt-1 text-lg font-semibold text-white">{score}/100</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${selectedTier.badge}`}>
          {selectedTier.label}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-200">{reasoning}</p>
    </div>
  );
}
