"use client";

import { useEffect } from "react";

type SettingsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-3xl border border-rose-400/30 bg-rose-950/80 p-8 text-slate-100 shadow-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-300">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">We couldn’t load settings</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        Please try again. If the problem continues, refresh the page and try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Try again
      </button>
    </div>
  );
}
