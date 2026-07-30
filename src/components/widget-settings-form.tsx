"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const accentStyles: Record<string, string> = {
  cyan: "bg-cyan-500 text-slate-950",
  purple: "bg-violet-500 text-slate-950",
  emerald: "bg-emerald-500 text-slate-950",
  amber: "bg-amber-400 text-slate-950",
};

const accentOptions = [
  { value: "cyan", label: "Cyan" },
  { value: "purple", label: "Purple" },
  { value: "emerald", label: "Emerald" },
  { value: "amber", label: "Amber" },
];

type WidgetSettings = {
  title: string;
  description: string;
  primaryAction: string;
  welcomeMessage: string;
  enableLeadCapture: boolean;
  accentColor: string;
};

const defaultSettings: WidgetSettings = {
  title: "Start your conversation",
  description: "Ask about your team, timeline, and goals to capture the right lead details without interrupting your workflow.",
  primaryAction: "Get started",
  welcomeMessage: "Hi there! Tell me about your project so I can help qualify your needs and connect you with the right team.",
  enableLeadCapture: true,
  accentColor: "cyan",
};

export function WidgetSettingsForm() {
  const [settings, setSettings] = useState<WidgetSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof WidgetSettings, value: string | boolean) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setSaved(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Widget settings</p>
          <h1 className="text-3xl font-semibold text-white">Widget configuration</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300">
            Customize the branding and lead capture experience for your embed widget. These values update the welcome text, CTA, and visual styling.
          </p>
        </div>

        {saved ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Widget settings saved locally.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="widget-title" className="text-sm font-medium text-slate-200">
              Widget title
            </label>
            <input
              id="widget-title"
              type="text"
              value={settings.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="widget-action" className="text-sm font-medium text-slate-200">
              Primary CTA label
            </label>
            <input
              id="widget-action"
              type="text"
              value={settings.primaryAction}
              onChange={(event) => updateField("primaryAction", event.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="widget-description" className="text-sm font-medium text-slate-200">
            Widget subtitle
          </label>
          <textarea
            id="widget-description"
            rows={3}
            value={settings.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="widget-welcome" className="text-sm font-medium text-slate-200">
            Welcome message
          </label>
          <textarea
            id="widget-welcome"
            rows={4}
            value={settings.welcomeMessage}
            onChange={(event) => updateField("welcomeMessage", event.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Capture leads</p>
              <p className="text-sm text-slate-400">Collect lead details from every conversation started through the widget.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={settings.enableLeadCapture}
                onChange={(event) => updateField("enableLeadCapture", event.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
              />
              Enabled
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-200">Accent color</p>
          <div className="grid gap-2 sm:grid-cols-4">
            {accentOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  settings.accentColor === option.value
                    ? "border-cyan-400 bg-slate-900/90 text-white"
                    : "border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
                }`}
              >
                <span>{option.label}</span>
                <input
                  type="radio"
                  name="accent-color"
                  value={option.value}
                  checked={settings.accentColor === option.value}
                  onChange={(event) => updateField("accentColor", event.target.value)}
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit" className="w-full">
            Save settings
          </Button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          >
            Reset defaults
          </button>
        </div>
      </form>

      <aside className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Live preview</p>
          <h2 className="text-xl font-semibold text-white">Widget preview</h2>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-5 shadow-sm">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/95 p-5">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Incoming widget</p>
              <h3 className="text-lg font-semibold text-white">{settings.title}</h3>
              <p className="text-sm leading-6 text-slate-400">{settings.description}</p>
            </div>

            <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
              <p className="text-sm text-slate-400">{settings.welcomeMessage}</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  {settings.enableLeadCapture ? "Lead capture on" : "Lead capture off"}
                </span>
                <button
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${accentStyles[settings.accentColor]}`}
                >
                  {settings.primaryAction}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
